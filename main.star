eth_network_package = import_module("github.com/kurtosis-tech/eth-network-package/main.star@no-genesis-low-block-time")
hardhat_module = import_module("github.com/kurtosis-tech/web3-tools/hardhat.star")

SSV_NODE_IMAGE = "bloxstaking/ssv-node:latest"

ACCOUNT_FROM_ETH = "ef5177cd0b6b21c87db5a0bf35d4084a8a57a9d6a064f86d51ac85f2b873a4e2"

# allowed values are prater/pyrmont/mainnet
NETWORK_NAME = "prater"

LATEST_BLOCK_NUMBER_GENERIC = "latest"
BLOCK_NUMBER_FIELD = "block-number"
BLOCK_HASH_FIELD = "block-hash"
JQ_PAD_HEX_FILTER = """{} | ascii_upcase | split("") | map({{"x": 0, "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "A": 10, "B": 11, "C": 12, "D": 13, "E": 14, "F": 15}}[.]) | reduce .[] as $item (0; . * 16 + $item)"""

def run(plan, args):
    args["seconds_per_slot"] = 1

    participants, _ = eth_network_package.run(plan, args)

    plan.print(participants)
    
    el_ip_addr = participants[0].el_client_context.ip_addr
    el_client_port = participants[0].el_client_context.rpc_port_num
    el_url = "http://{0}:{1}".format(el_ip_addr, el_client_port)

    beacon_node_addr = participants[0].cl_client_context.ip_addr
    beacon_node_port = participants[0].cl_client_context.http_port_num
    beacon_url = "http://{0}:{1}".format(beacon_node_addr, beacon_node_port)
    
    template_data = {
        "BeaconNodeAddr": beacon_url,
        "Network": NETWORK_NAME,
        "ElNodeUrl": el_url,
    }

    config_artifact = plan.render_templates(
        config = {
            "config.yml": struct(
                template = read_file("github.com/kurtosis-tech/ssv-demo/templates/config.yml.tmpl"),
                data = template_data
            )
        }
    )

    launch_ssv_node(plan, config_artifact)

    # # spin up hardhat
    hardhat_env_vars = {
        "RPC_URI": el_url
    }

    hardhat_project = "github.com/kurtosis-tech/ssv-demo/ssv-network"
    hardhat = hardhat_module.init(plan, hardhat_project, hardhat_env_vars)

    plan.exec(
        service_name = "hardhat",
        recipe = ExecRecipe(
            command = ["/bin/sh", "-c", "apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python"]
        )
    )

    plan.exec(
        service_name = "hardhat",
        recipe = ExecRecipe(
            command = ["/bin/sh", "-c", "cd /tmp/hardhat && npm install"]
        )
    )

    plan.exec(
        service_name = "hardhat",
        recipe = ExecRecipe(
            command = ["/bin/sh", "-c", 'cd /tmp/hardhat && npm install --save-dev "@nomicfoundation/hardhat-network-helpers@^1.0.0" "@nomicfoundation/hardhat-chai-matchers@^1.0.0" "@nomiclabs/hardhat-etherscan@^3.0.0" "@typechain/ethers-v5@^10.1.0" "@typechain/hardhat@^6.1.2" "chai@^4.2.0" "hardhat-gas-reporter@^1.0.8" "solidity-coverage@^0.8.1" "typechain@^8.1.0"']
        )
    )

    plan.exec(
        service_name = "hardhat",
        recipe = ExecRecipe(
            command = ["/bin/sh", "-c", "cd /tmp/hardhat && npm install"]
        )
    )
    
    hardhat_module.compile(plan)

    # have to wait for at least block to be mined before deploying contract
    wait_until_node_reached_block(plan, "el-client-0", 1)

    hardhat_module.run(plan, "scripts/deploy-all.ts", "localnet")


def launch_ssv_node(plan, config_artifact):
    plan.add_service(
        name  = "ssv-service",
        config = ServiceConfig(
            image = SSV_NODE_IMAGE,
            cmd = ["/go/bin/ssvnode", "start-node", "--config", "/tmp/config.yml"],
            ports = {
                "tcp": PortSpec(number = 13001, transport_protocol = "TCP", wait = None),
                "udp": PortSpec(number = 12001, transport_protocol = "UDP"),
                "metrics": PortSpec(number = 15000, transport_protocol = "UDP"),
            },
            files = {
                "/tmp": config_artifact
            },
            env_vars = {
                "CONFIG_PATH": "/tmp/config.yml"
            }
        )
    )



def wait_until_node_reached_block(plan, node_id, target_block_number_int):
    """
    This function blocks until the node `node_id` has reached block number `target_block_number_int` (which should
    be an integer)
    If node has already produced this block, it returns immediately.
    """
    plan.wait(
        recipe=get_block_recipe(LATEST_BLOCK_NUMBER_GENERIC),
        field="extract." + BLOCK_NUMBER_FIELD,
        assertion=">=",
        target_value=target_block_number_int,
        timeout="20m",  # Ethereum nodes can take a while to get in good shapes, especially at the beginning
        service_name=node_id,
    )


def get_block_recipe(block_number_hex):
    """
    Returns the recipe to run to get the block information for block number `block_number_hex` (which should be a 
    hexadecimal string starting with `0x`, i.e. `0x2d`)
    """
    request_body = """{{
    "method": "eth_getBlockByNumber",
    "params":[
        "{}",
        true
    ],
    "id":1,
    "jsonrpc":"2.0"
}}""".format(block_number_hex)
    return PostHttpRequestRecipe(
        port_id="rpc",
        endpoint="/",
        content_type="application/json",
        body=request_body,
        extract={
            BLOCK_NUMBER_FIELD: JQ_PAD_HEX_FILTER.format(".result.number"),
            BLOCK_HASH_FIELD: ".result.hash",
        },
    )
