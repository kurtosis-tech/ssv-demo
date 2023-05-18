eth_network_package = import_module("github.com/kurtosis-tech/eth-network-package/main.star")
hardhat_module = import_module("github.com/kurtosis-tech/web3-tools/hardhat.star")

SSV_NODE_IMAGE = "bloxstaking/ssv-node:latest"

ACCOUNT_FROM_ETH = "ef5177cd0b6b21c87db5a0bf35d4084a8a57a9d6a064f86d51ac85f2b873a4e2"

ETH_NETWORK_ID = "3151908"

def run(plan, args):
    participants, _ = eth_network_package.run(plan, args)

    plan.print(participants)
    
    el_ip_addr = participants[0].el_client_context.ip_addr
    el_client_port = participants[0].el_client_context.ws_port_num
    el_url = "http://{0}:{1}".format(el_ip_addr, el_client_port)

    beacon_node_addr = participants[0].cl_client_context.ip_addr
    beacon_node_port = participants[0].cl_client_context.http_port_num
    beacon_url = "http:///{0}:{1}".format(beacon_node_addr, beacon_node_port)
    
    template_data = {
        "BeaconNodeAddr": beacon_url,
        "Network": ETH_NETWORK_ID,
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

    # hardhat_env_vars = {
    #     "RPC_URI": rpc_url
    # }

    # # spin up hardhat
    # hardhat_project = "github.com/kurtosis-tech/web3-tools/smart-contract-example"
    # hardhat = hardhat_module.init(plan, hardhat_project, hardhat_env_vars)
    
    # hardhat_module.task(plan, "balances", "localnet")
    # hardhat_module.compile(plan)
    # hardhat_module.run(plan, "scripts/deploy.ts", "localnet")
    # hardhat_module.cleanup(plan)



def launch_ssv_node(plan, config_artifact):
    plan.add_service(
        name  = "ssv-service",
        config = ServiceConfig(
            image = SSV_NODE_IMAGE,
            cmd = ["make", "BUILD_PATH=/go/bin/ssvnode", "start-node"],
            ports = {
                "tcp": PortSpec(number = 13001, transport_protocol = "TCP"),
                "udp": PortSpec(number = 12001, transport_protocol = "UDP")
            },
            files = {
                "/tmp": config_artifact
            },
            env_vars = {
                "CONFIG_PATH": "/tmp/config.yml"
            }
        )
    )