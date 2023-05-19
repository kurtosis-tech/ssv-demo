import { ethers, upgrades } from 'hardhat';

async function deploy() {

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account:${deployer.address}`);


  const registerAuthFactory = await ethers.getContractFactory('RegisterAuth');
  const registerAuth = await upgrades.deployProxy(registerAuthFactory, [],
    {
      kind: 'uups'
    });

  await registerAuth.deployed();
  console.log(`RegisterAuth proxy deployed to: ${registerAuth.address}`);

  const ssvToken = await ethers.getContractFactory('SSVTokenMock');
  let ssvTokenDeploy = await ssvToken.deploy();
  await ssvTokenDeploy.deployed();

  const ssvTokenAddress = ssvTokenDeploy.address;

  // deploy SSVNetwork
  const ssvNetworkFactory = await ethers.getContractFactory('SSVNetwork');
  console.log(`Deploying SSVNetwork with ssvToken ${ssvTokenAddress}`);
  const ssvNetwork = await upgrades.deployProxy(ssvNetworkFactory, [
    "0.0.1",
    ssvTokenAddress,
    1000,
    3600,
    86400,
    100800,
    200000000,
    500,
  ],
    {
      kind: "uups",
      unsafeAllow: ['state-variable-immutable', 'constructor'],
      constructorArgs: [registerAuth.address]
    });
  await ssvNetwork.deployed();
  console.log(`SSVNetwork proxy deployed to: ${ssvNetwork.address}`);

  let implAddress = await upgrades.erc1967.getImplementationAddress(ssvNetwork.address);
  console.log(`SSVNetwork implementation deployed to: ${implAddress}`);

  // deploy SSVNetworkViews
  const ssvViewsFactory = await ethers.getContractFactory('SSVNetworkViews');
  console.log(`Deploying SSVNetworkViews with SSVNetwork ${ssvNetwork.address}...`);
  const viewsContract = await upgrades.deployProxy(ssvViewsFactory, [
    ssvNetwork.address
  ],
    {
      kind: "uups"
    });
  await viewsContract.deployed();
  console.log(`SSVNetworkViews proxy deployed to: ${viewsContract.address}`);

  implAddress = await upgrades.erc1967.getImplementationAddress(viewsContract.address);
  console.log(`SSVNetworkViews implementation deployed to: ${implAddress}`);
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
