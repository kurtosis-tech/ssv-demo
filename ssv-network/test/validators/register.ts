// Declare imports
import * as helpers from '../helpers/contract-helpers';
import * as utils from '../helpers/utils';
import { expect } from 'chai';
import { trackGas, GasGroup } from '../helpers/gas-usage';

let ssvNetworkContract: any, ssvViews: any, minDepositAmount: any, registerAuth: any, cluster1: any;

describe('Register Validator Tests', () => {
  beforeEach(async () => {
    // Initialize contract
    const metadata = (await helpers.initializeContract());
    ssvNetworkContract = metadata.contract;
    ssvViews = metadata.ssvViews;
    registerAuth = metadata.registerAuth;

    // Register operators
    await helpers.registerOperators(0, 14, helpers.CONFIG.minimalOperatorFee);

    minDepositAmount = (helpers.CONFIG.minimalBlocksBeforeLiquidation + 2) * helpers.CONFIG.minimalOperatorFee * 13;

    // cold register
    await registerAuth.setAuth(helpers.DB.owners[6].address, [false, true]);
    await helpers.DB.ssvToken.connect(helpers.DB.owners[6]).approve(helpers.DB.ssvNetwork.contract.address, '1000000000000000');
    cluster1 = await trackGas(ssvNetworkContract.connect(helpers.DB.owners[6]).registerValidator(
      helpers.DataGenerator.publicKey(90),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(4),
      '1000000000000000',
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ));
    await registerAuth.setAuth(helpers.DB.owners[1].address, [true, true]);
    await registerAuth.setAuth(helpers.DB.owners[0].address, [true, true]);
  });

  it('Register validator with 4 operators emits "ValidatorAdded"', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    await expect(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(4),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    )).to.emit(ssvNetworkContract, 'ValidatorAdded');
  });

  it('Register validator with 4 operators gas limit', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      helpers.DataGenerator.cluster.new(),
      helpers.DataGenerator.shares(4),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE]);
  });

  it('Register 2 validators into the same cluster gas limit', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    const { eventsByName } = await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(4),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE]);

    const args = eventsByName.ValidatorAdded[0].args;

    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(2),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(4),
      minDepositAmount,
      args.cluster
    ), [GasGroup.REGISTER_VALIDATOR_EXISTING_POD]);
  });

  it('Register 2 validators into the same cluster and 1 validator into a new cluster gas limit', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    const { eventsByName } = await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(4),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE]);

    const args = eventsByName.ValidatorAdded[0].args;

    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(2),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(4),
      minDepositAmount,
      args.cluster
    ), [GasGroup.REGISTER_VALIDATOR_EXISTING_POD]);

    await registerAuth.setAuth(helpers.DB.owners[2].address, [false, true]);

    await helpers.DB.ssvToken.connect(helpers.DB.owners[2]).approve(ssvNetworkContract.address, minDepositAmount);
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[2]).registerValidator(
      helpers.DataGenerator.publicKey(4),
      [2, 3, 4, 5],
      helpers.DataGenerator.shares(4),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE]);
  });

  it('Register 2 validators into the same cluster with one time deposit gas limit', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, `${minDepositAmount * 2}`);
    const { eventsByName } = await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(4),
      `${minDepositAmount * 2}`,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE]);

    const args = eventsByName.ValidatorAdded[0].args;
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(2),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(4),
      0,
      args.cluster
    ), [GasGroup.REGISTER_VALIDATOR_WITHOUT_DEPOSIT]);
  });

  // 7 operators

  it('Register validator with 7 operators gas limit', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      helpers.DataGenerator.cluster.new(7),
      helpers.DataGenerator.shares(7),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE_7]);
  });

  it('Register 2 validators with 7 operators into the same cluster gas limit', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    const { eventsByName } = await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      [1, 2, 3, 4, 5, 6, 7],
      helpers.DataGenerator.shares(7),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE_7]);

    const args = eventsByName.ValidatorAdded[0].args;

    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(2),
      [1, 2, 3, 4, 5, 6, 7],
      helpers.DataGenerator.shares(7),
      minDepositAmount,
      args.cluster
    ), [GasGroup.REGISTER_VALIDATOR_EXISTING_POD_7]);
  });

  it('Register 2 validators with 7 operators into the same cluster and 1 validator into a new cluster with 7 operators gas limit', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    const { eventsByName } = await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      [1, 2, 3, 4, 5, 6, 7],
      helpers.DataGenerator.shares(7),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE_7]);

    const args = eventsByName.ValidatorAdded[0].args;

    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(2),
      [1, 2, 3, 4, 5, 6, 7],
      helpers.DataGenerator.shares(7),
      minDepositAmount,
      args.cluster
    ), [GasGroup.REGISTER_VALIDATOR_EXISTING_POD_7]);

    await registerAuth.setAuth(helpers.DB.owners[2].address, [false, true]);

    await helpers.DB.ssvToken.connect(helpers.DB.owners[2]).approve(ssvNetworkContract.address, minDepositAmount);
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[2]).registerValidator(
      helpers.DataGenerator.publicKey(4),
      [2, 3, 4, 5, 6, 7, 8],
      helpers.DataGenerator.shares(7),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE_7]);
  });

  it('Register 2 validators with 7 operators into the same cluster with one time deposit gas limit', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, `${minDepositAmount * 2}`);
    const { eventsByName } = await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      [1, 2, 3, 4, 5, 6, 7],
      helpers.DataGenerator.shares(7),
      `${minDepositAmount * 2}`,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE_7]);

    const args = eventsByName.ValidatorAdded[0].args;
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(2),
      [1, 2, 3, 4, 5, 6, 7],
      helpers.DataGenerator.shares(7),
      0,
      args.cluster
    ), [GasGroup.REGISTER_VALIDATOR_WITHOUT_DEPOSIT_7]);
  });

  // 10 operators

  it('Register validator with 10 operators gas limit', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      helpers.DataGenerator.cluster.new(10),
      helpers.DataGenerator.shares(10),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE_10]);
  });

  it('Register 2 validators with 10 operators into the same cluster gas limit', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    const { eventsByName } = await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      helpers.DataGenerator.shares(10),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE_10]);

    const args = eventsByName.ValidatorAdded[0].args;

    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(2),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      helpers.DataGenerator.shares(10),
      minDepositAmount,
      args.cluster
    ), [GasGroup.REGISTER_VALIDATOR_EXISTING_POD_10]);
  });

  it('Register 2 validators with 10 operators into the same cluster and 1 validator into a new cluster with 10 operators gas limit', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    const { eventsByName } = await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      helpers.DataGenerator.shares(10),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE_10]);

    const args = eventsByName.ValidatorAdded[0].args;

    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(2),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      helpers.DataGenerator.shares(10),
      minDepositAmount,
      args.cluster
    ), [GasGroup.REGISTER_VALIDATOR_EXISTING_POD_10]);

    await registerAuth.setAuth(helpers.DB.owners[2].address, [false, true]);

    await helpers.DB.ssvToken.connect(helpers.DB.owners[2]).approve(ssvNetworkContract.address, minDepositAmount);
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[2]).registerValidator(
      helpers.DataGenerator.publicKey(4),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      helpers.DataGenerator.shares(10),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE_10]);
  });

  it('Register 2 validators with 10 operators into the same cluster with one time deposit gas limit', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, `${minDepositAmount * 2}`);
    const { eventsByName } = await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      helpers.DataGenerator.shares(10),
      `${minDepositAmount * 2}`,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE_10]);

    const args = eventsByName.ValidatorAdded[0].args;
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(2),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      helpers.DataGenerator.shares(10),
      0,
      args.cluster
    ), [GasGroup.REGISTER_VALIDATOR_WITHOUT_DEPOSIT_10]);
  });

  // 13 operators

  it('Register validator with 13 operators gas limit', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      helpers.DataGenerator.cluster.new(13),
      helpers.DataGenerator.shares(13),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE_13]);
  });

  it('Register 2 validators with 13 operators into the same cluster gas limit', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    const { eventsByName } = await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      helpers.DataGenerator.shares(13),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE_13]);

    const args = eventsByName.ValidatorAdded[0].args;

    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(2),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      helpers.DataGenerator.shares(13),
      minDepositAmount,
      args.cluster
    ), [GasGroup.REGISTER_VALIDATOR_EXISTING_POD_13]);
  });

  it('Register 2 validators with 13 operators into the same cluster and 1 validator into a new cluster with 13 operators gas limit', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    const { eventsByName } = await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      helpers.DataGenerator.shares(13),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE_13]);

    const args = eventsByName.ValidatorAdded[0].args;

    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, minDepositAmount);
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(2),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      helpers.DataGenerator.shares(13),
      minDepositAmount,
      args.cluster
    ), [GasGroup.REGISTER_VALIDATOR_EXISTING_POD_13]);

    await registerAuth.setAuth(helpers.DB.owners[2].address, [false, true]);

    await helpers.DB.ssvToken.connect(helpers.DB.owners[2]).approve(ssvNetworkContract.address, minDepositAmount);
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[2]).registerValidator(
      helpers.DataGenerator.publicKey(4),
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      helpers.DataGenerator.shares(13),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE_13]);
  });

  it('Register 2 validators with 13 operators into the same cluster with one time deposit gas limit', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, `${minDepositAmount * 2}`);
    const { eventsByName } = await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      helpers.DataGenerator.shares(13),
      `${minDepositAmount * 2}`,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), [GasGroup.REGISTER_VALIDATOR_NEW_STATE_13]);

    const args = eventsByName.ValidatorAdded[0].args;
    await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(2),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      helpers.DataGenerator.shares(13),
      0,
      args.cluster
    ), [GasGroup.REGISTER_VALIDATOR_WITHOUT_DEPOSIT_13]);
  });

  it('Get cluster burn rate', async () => {
    const networkFee = helpers.CONFIG.minimalOperatorFee;
    await ssvNetworkContract.updateNetworkFee(networkFee);

    let clusterData = cluster1.eventsByName.ValidatorAdded[0].args.cluster;
    expect(await ssvViews.getBurnRate(helpers.DB.owners[6].address, [1, 2, 3, 4], clusterData)).to.equal((helpers.CONFIG.minimalOperatorFee * 4) + networkFee);

    await helpers.DB.ssvToken.connect(helpers.DB.owners[6]).approve(helpers.DB.ssvNetwork.contract.address, '1000000000000000');
    const validator2 = await trackGas(ssvNetworkContract.connect(helpers.DB.owners[6]).registerValidator(
      helpers.DataGenerator.publicKey(2),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(4),
      '1000000000000000',
      clusterData
    ));
    clusterData = validator2.eventsByName.ValidatorAdded[0].args.cluster;
    expect(await ssvViews.getBurnRate(helpers.DB.owners[6].address, [1, 2, 3, 4], clusterData)).to.equal(((helpers.CONFIG.minimalOperatorFee * 4) + networkFee) * 2);
  });

  it('Get cluster burn rate when one of the operators does not exsit', async () => {
    const clusterData = cluster1.eventsByName.ValidatorAdded[0].args.cluster;
    await expect(ssvViews.getBurnRate(helpers.DB.owners[6].address, [1, 2, 3, 41], clusterData)).to.be.revertedWithCustomError(ssvNetworkContract, 'ClusterDoesNotExists');
  });

  it('Register validator with incorrect input data reverts "IncorrectClusterState"', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, `${minDepositAmount * 2}`);
    await ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(2),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(4),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    );

    await expect(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(3),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(4),
      minDepositAmount,
      {
        validatorCount: 2,
        networkFeeIndex: 10,
        index: 0,
        balance: 0,
        active: true
      }
    )).to.be.revertedWithCustomError(ssvNetworkContract, 'IncorrectClusterState');
  });

  it('Register validator in a new cluster with incorrect input data reverts "IncorrectClusterState"', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, `${minDepositAmount * 2}`);
    await expect(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(3),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(4),
      minDepositAmount,
      {
        validatorCount: 2,
        networkFee: 10,
        networkFeeIndex: 10,
        index: 10,
        balance: 10,
        active: false
      }
    )).to.be.revertedWithCustomError(ssvNetworkContract, 'IncorrectClusterState');
  });

  it('Register validator when an operator does not exsit in the cluster reverts "OperatorDoesNotExist"', async () => {
    await expect(ssvNetworkContract.registerValidator(
      helpers.DataGenerator.publicKey(2),
      [1, 2, 3, 25],
      helpers.DataGenerator.shares(4),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    )).to.be.revertedWithCustomError(ssvNetworkContract, 'OperatorDoesNotExist');
  });

  it('Register validator with a removed operator in the cluster reverts "OperatorDoesNotExist"', async () => {
    await ssvNetworkContract.removeOperator(1);
    await expect(ssvNetworkContract.registerValidator(
      helpers.DataGenerator.publicKey(4),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(4),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    )).to.be.revertedWithCustomError(ssvNetworkContract, 'OperatorDoesNotExist');
  });


  it('Register cluster with unsorted operators reverts "UnsortedOperatorsList"', async () => {
    await expect(helpers.registerValidators(2, 1, minDepositAmount, [3, 2, 1, 4])).to.be.revertedWithCustomError(ssvNetworkContract, 'UnsortedOperatorsList');
  });

  it('Register cluster with duplicated operators reverts "OperatorsListNotUnique"', async () => {
    await expect(helpers.registerValidators(2, 1, minDepositAmount, [3, 6, 9, 12, 12, 17, 20])).to.be.revertedWithCustomError(ssvNetworkContract, 'OperatorsListNotUnique');
  });

  it('Register validator into a cluster with an invalid amount of operators reverts "InvalidOperatorIdsLength"', async () => {
    // 2 Operators
    await expect(helpers.registerValidators(2, 1, minDepositAmount, [1, 2])).to.be.revertedWithCustomError(ssvNetworkContract, 'InvalidOperatorIdsLength');

    // 6 Operators
    await expect(helpers.registerValidators(2, 1, minDepositAmount, [1, 2, 3, 4, 5, 6])).to.be.revertedWithCustomError(ssvNetworkContract, 'InvalidOperatorIdsLength');

    // 14 Operators
    await expect(helpers.registerValidators(2, 1, minDepositAmount, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])).to.be.revertedWithCustomError(ssvNetworkContract, 'InvalidOperatorIdsLength');
  });

  it('Register validator with an invalid public key length reverts "InvalidPublicKeyLength"', async () => {
    await expect(ssvNetworkContract.registerValidator(
      helpers.DataGenerator.shares(0),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(4),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    )).to.be.revertedWithCustomError(ssvNetworkContract, 'InvalidPublicKeyLength');
  });

  it('Register validator with not enough balance reverts "InsufficientBalance"', async () => {
    await helpers.DB.ssvToken.approve(ssvNetworkContract.address, helpers.CONFIG.minimalOperatorFee);
    await expect(ssvNetworkContract.registerValidator(
      helpers.DataGenerator.publicKey(1),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(4),
      helpers.CONFIG.minimalOperatorFee,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    )).to.be.revertedWithCustomError(ssvNetworkContract, 'InsufficientBalance');
  });

  it('Register validator in a liquidatable cluster with not enough balance reverts "InsufficientBalance"', async () => {
    const depositAmount = helpers.CONFIG.minimalBlocksBeforeLiquidation * helpers.CONFIG.minimalOperatorFee * 4;

    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, depositAmount);
    const { eventsByName } = await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(4),
      depositAmount,
      {
        validatorCount: 0,
        networkFee: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ));
    const cluster1 = eventsByName.ValidatorAdded[0].args;

    await utils.progressBlocks(helpers.CONFIG.minimalBlocksBeforeLiquidation + 10);

    await helpers.DB.ssvToken.connect(helpers.DB.owners[1]).approve(ssvNetworkContract.address, helpers.CONFIG.minimalOperatorFee);
    await expect(ssvNetworkContract.connect(helpers.DB.owners[1]).registerValidator(
      helpers.DataGenerator.publicKey(2),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(3),
      helpers.CONFIG.minimalOperatorFee,
      cluster1.cluster
    )).to.be.revertedWithCustomError(ssvNetworkContract, 'InsufficientBalance');
  });


  it('Register an existing validator reverts "ValidatorAlreadyExists"', async () => {
    await helpers.DB.ssvToken.connect(helpers.DB.owners[6]).approve(ssvNetworkContract.address, helpers.CONFIG.minimalOperatorFee);
    await expect(ssvNetworkContract.connect(helpers.DB.owners[6]).registerValidator(
      helpers.DataGenerator.publicKey(90),
      [1, 2, 3, 4],
      helpers.DataGenerator.shares(4),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    )).to.be.revertedWithCustomError(ssvNetworkContract, 'ValidatorAlreadyExists');
  });

  it('Surpassing max number of validators per operator reverts "ExceedValidatorLimit"', async () => {
    await helpers.registerValidatorsRaw(2, 50, minDepositAmount, [8, 9, 10, 11]);

    const SSVNetworkValidatorsPerOperator = await ethers.getContractFactory("SSVNetworkValidatorsPerOperator");
    const ssvNetwork = await upgrades.upgradeProxy(ssvNetworkContract.address, SSVNetworkValidatorsPerOperator, {
      kind: 'uups',
      call: {
        fn: 'initializev2',
        args: [25]
      },
      unsafeAllow: ['constructor'],
      constructorArgs: [registerAuth.address],
    });
    await ssvNetwork.deployed();

    await helpers.DB.ssvToken.connect(helpers.DB.owners[6]).approve(ssvNetwork.address, minDepositAmount);
    await expect(ssvNetwork.connect(helpers.DB.owners[6]).registerValidator(
      helpers.DataGenerator.publicKey(55),
      [8, 9, 12, 14],
      helpers.DataGenerator.shares(4),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    )).to.be.revertedWithCustomError(ssvNetwork, 'ExceedValidatorLimit');

  });

  it('Register whitelisted validator in 1 operator with 4 operators emits "ValidatorAdded"', async () => {
    const result = await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerOperator(
      helpers.DataGenerator.publicKey(20),
      helpers.CONFIG.minimalOperatorFee
    ));
    const { operatorId } = result.eventsByName.OperatorAdded[0].args;

    await ssvNetworkContract.connect(helpers.DB.owners[1]).setOperatorWhitelist(operatorId, helpers.DB.owners[3].address);

    await registerAuth.setAuth(helpers.DB.owners[3].address, [false, true]);

    await helpers.DB.ssvToken.connect(helpers.DB.owners[3]).approve(ssvNetworkContract.address, minDepositAmount);
    await expect(ssvNetworkContract.connect(helpers.DB.owners[3]).registerValidator(
      helpers.DataGenerator.publicKey(1),
      [1, 2, 3, operatorId],
      helpers.DataGenerator.shares(4),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    )).to.emit(ssvNetworkContract, 'ValidatorAdded');
  });

  it('Register a non whitelisted validator reverts "CallerNotWhitelisted"', async () => {
    const result = await trackGas(ssvNetworkContract.connect(helpers.DB.owners[1]).registerOperator(
      helpers.DataGenerator.publicKey(22),
      helpers.CONFIG.minimalOperatorFee
    ));
    const { operatorId } = result.eventsByName.OperatorAdded[0].args;

    await ssvNetworkContract.connect(helpers.DB.owners[1]).setOperatorWhitelist(operatorId, helpers.DB.owners[3].address);

    await helpers.DB.ssvToken.approve(ssvNetworkContract.address, minDepositAmount);
    await expect(ssvNetworkContract.registerValidator(
      helpers.DataGenerator.publicKey(1),
      [1, 2, 3, operatorId],
      helpers.DataGenerator.shares(4),
      minDepositAmount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    )).to.be.revertedWithCustomError(ssvNetworkContract, 'CallerNotWhitelisted');
  });

  it('Retrieve an existing validator', async () => {
    const validator = await ssvViews.getValidator(helpers.DataGenerator.publicKey(90));
    expect(validator[0]).to.be.equals(helpers.DB.owners[6].address);
    expect(validator[1]).to.be.equals(true);
  });

  it('Retrieve a non-existing validator', async () => {
    const validator = await ssvViews.getValidator(helpers.DataGenerator.publicKey(1));
    expect(validator[0]).to.be.equals(ethers.constants.AddressZero);
    expect(validator[1]).to.be.equals(false);
  });
});
