eth_network_package = import_module("github.com/kurtosis-tech/eth-network-package/main.star")
hardhat_module = import_module("github.com/kurtosis-tech/web3-tools/hardhat.star")

SSV_NODE_IMAGE = "ssvnode:latest"

ACCOUNT_FROM_ETH = "ef5177cd0b6b21c87db5a0bf35d4084a8a57a9d6a064f86d51ac85f2b873a4e2"

def run(plan, args):
    participants, _ = eth_network_package.run(plan, args)
    el_client_rpc_ip_addr = participants[0].el_client_context.ip_addr
    el_client_rpc_port = participants[0].el_client_context.rpc_port_num
    rpc_url = "http://{0}:{1}".format(el_client_rpc_ip_addr, el_client_rpc_port)


    launch_ssv_node(plan, rpc_url)


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



def launch_ssv_node(plan, rpc_url):
    env_vars = {
        "CONFIG_PATH": "./config/config.yaml",
        "_ETH_NODE_URL": rpc_url,
        "_OWNER_PRIVATE_KEY": ACCOUNT_FROM_ETH,
    }
    plan.add_service(
        name  = "ssv-service",
        config = ServiceConfig(
            image = SSV_NODE_IMAGE,
            command = ["start-node"],
            env_vars = env_vars,
        )
    )