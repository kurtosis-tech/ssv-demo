// Imports
declare const ethers: any;

import { trackGas, GasGroup } from './gas-usage';

export let DB: any;
export let CONFIG: any;

const SHARES_RSA = [
  // 4 shares
  '0x018281ac5380c3461afba00bfdd853b1cfe52cfcd9b3e43d2971848e9d95ad8ee0134aa6af6ff52b96a7eba070eb1064603e8c027bb7e3b11c399e2aeef8e25953c47cba31440c7f09b64e42d0f429e155b7fdeba9dec68e1cfb057d26659f157a7898e60347a7971b00a3332bc1c2ee6c9c8bc628a4985eeeb0d685707c8c939731c99797af712e3a1f65325748b12776938c2b5a5bd8d258a4258998be971c661837f0427bd95e189e07ec831d43aaf6cb1820fccbb735e228b741395d0386b2e3c397fe1f9fe0f3e9e998dcfb41de10b7df8d42a10387f1d6d47c721a9582cc82675fb24f50674aeeb5115e55f7382800999da85346c9ab794d154648cbcd5e7667ab0b73a0d9caeed618e015dcb66193c24c86249e2958badd1b5fb541a5865fa0cac6621580fd96191699c83d75738d899960670889a4425c5b066720e607ce1c1fe32e27e4f880758299ac2d03b6523e22895e583561cce8019f4b87fd6a99c7b1444ca10f41fb2b98d6f50717058984795d76fcfefc627e0d7a18ea9b52b8dac0b6b38c3579dc8111ff8ce14d7cb221cc51a5c113f13c86bb141030ff08e9924c97508430182ff72b3ac79f3fcfdd6fe16981ab4fa674e571c44f4a36cf5731c0e15fdc6dbceb2e129a4eb9e0eb8251b3d1e242eced9bd4b3dd6ce2c6e737b7d0d57fafb34f459d8725d216b9d5f1ff790a2e228f0376ced846b65d814ffe031ce40adeedbcee7bf158af3ee4375eee14fee246d046091ebacc8e2da3cae5d7b1ab5936f152ec2d1f7d4be4623b4db0f0e49e9940056ca4012fa1a1d3b4c81ae02a07869064d42edc76a7faa8f48d754d3f4e9942e34f5da49b7d3f2ec2eb66f427634eb43f68b9ec1cba34e368070f25a483e7b482a98c8cda30976fc791fbf376ad40fcb38a38dbbfee35b7d333daa2729769a632902f9950fd2e0f1e6174d9ebc369d002123176a3f73ec71001e0de34df65eb208d493e8c36b5da34a03e42399fc6b1c49da35096eabc77474d968653a414b9ab42cbbec502cf4705662dfbc73281757fe4535093a872072189c3b9ea3b5d6843f8221d6cb82e9cfc6d0388948c931680a8679361f38d53ea21b160e436a9f050e51c1e8453484fa1e9f3a20d16319d4626421d6b03df8a267e29407a7c04e0a43211769002ab61a1f9017f52994282a6d1699cb85cf2013d4b341081234ca3274dff0e1b77678809c92ac8181a53c72f047e972280c8eafc4be871e3faf3616f29ec389b4953469a2a30ede4a8a9e5e62792c8d37063571b075228aab33324b62850f0844d8952d1ae6a99a6b887067a66087acea207a9ef6b4f55a82c6e30d6dcb983a7c63714f6dc409f46f6b338cfc2de5969c1ecda938ce889f4aa8fb4eee8dc0d5ffc0d2ac7f0dd65a622fd515ca2a21376e9ba15e99241a85a3951871bd438b047517e8e0b4ddf2ff273a30b3ed483f6f20b183ba311e2c4de0a905e9cb4fdf2560c3b5ede0f988623dfe8d2ed27ca157e060e3558b2cfb1d87ae8751dc7432db61056b5e185356d2e72f732c29b5b47a1c287ce5f1be1c162f0b8a1ed93a30269948463679e55e013485b61775328ce08bad3e4ecf8aab485002f65407c0a1afd90e5a3e44909ba6d0d428e77b92ab873bf0217cd6ff7d6d48616efe4d4dc122ac787ee4f6d9c030b1a10403268c0158c7cd7ae821a6754601f710b9731e37c0dc067b5a2ab',
  // 7 shares
  '0x02a2871c338c3206657ce90c00655f526a2055355bde197116efcc55de8b7bc69db23f2a78c91ccee05bd48c03f1d4903631930f49165acc5e605bcdbd1a4bcdd7b44366f2af42e4126cbffc9e34ec9fa29662a401c5aa7ebef5e4ee287c895617dc930f49165acc5e605bcdbd1a4bcdd7b44366f2af42e4126cbffc9e34ec9fa29662a401c5aa7ebef5e4ee287c895617dcaf4dd395545044ac2c83fe26548751891ac655ede78d6d346d5c1611ec39cd5b828440dddc8d5739253a272b128ea962af4dd395545044ac2c83fe26548751891ac655ede78d6d346d5c1611ec39cd5b828440dddc8d5739253a272b128ea962871c338c3206657ce90c00655f526a2055355bde197116efcc55de8b7bc69db23f2a78c91ccee05bd48c03f1d4903631b7d586100b1137d7c7fc4c9b6aad63021581fcd3fa6bb55455e6eb5e42fdba1b1fe1e25b8a350c47f4904064241c034c5dc03027fb3532501eff0877819eedebeb982d651c47ccc7cecf2cc508ad3ba7dd802e993acbaf696a6dcce1eada8ad77c75fc6085a183990b6fadbfb888205b29e17a00671ce8d04b9f3dd64283c29a58ec2ea3a4f1da6227c207708024bc6243e77f41ad7c219e40e14a4b965a9e9957a44fceba379b7c0082d25446c8d3cbb5e0f81b5fea835f5277f6cb3e62df9680f182571466fdbd28585cd2571c832ce11ff9c9a1d144a505f2ff198b6ab3ba19b0ce3096967635c916be872dacefe2c5477c6da28d6a47fd49d8ecad7f161a8d69fb343ca785c795c3242639866789f8d8631693c4a5c68e5a95061e176635d39e28f9afa9a1f23b5ddaaa6212bc699982631ed39ea56134e10efd459421f4abb9a8d9881e78d538c536e0e3062dd3f0f4ac19e2bf0e8329eaf86279235e6b13507f27a3a1afb5845ffe3fe09b1865f2c9cdccd7efc2c1a45244e67cd62ea7ac5a3316e19ed019d7ba0ac6e420f303e2a951e043e7d69b98a8e0975c69c373074a69f40e423bc4787338b33fa1dc15642849a66d89be6c614c9d7372918ed3f12c8767aeda14800cdde15ed83e1df9824b71fcfe636cdb755c374a9df628a9e2f189c900b02a57306e4099b794cb42fa84dc43e186e9e10e2c786a75b32ffdeaf228a77e53b013d830ebbbbb72af84dbf2f64bd66f0584f26a38324d93ae0acb717c60daa7c947fb4cce4d1865fbbb9982631ed39ea56134e10efd459421f4abb9a8d9881e78d538c536e0e3062dd3f0f4ac19e2bf0e8329eaf86279235e6b13507f27a3a1afb5845ffe3fe09b1865f2c9cdccd7efc2c1a45244e67cd62ea7ac5a3316e19ed019d7ba0ac6e420f303e2a951e043e7d69b98a8e0975c69c373074a69f40e423bc4787338b33fa1dc15642849a66d89be6c614c9d7372918ed3f12c8767aeda14800cdde15ed83e1df9824b71fcfe636cdb755c374a9df628a9e2f189c900b02a57306e4099b794cb42fa84dc43e186e9e10e2c786a75b32ffdeaf228a77e53b013d830ebbbbb72af84dbf2f64bd66f0584f26a38324d93ae0acb717c60daa7c947fb4cce4d1865fbbb343775b368f031ebb11cf73a910c86aa91ab662ccd0dabbec26d656551c1fa4bdd55f72c8f24e0442a453f229633f2db01cb728f38dea94fa3d7319d0689c128eb60ca2935673df587f8c60901fd8ac0eba49510ba1b7f51198c7840524eb237c35da262718eb64918f7c39cf64e47bcdd88abd4c16b0ea220e4f598f721e8d1338422d8c77ea63eac77c7644c516d4d7118fbae442839563243684046c25a445b48d4678e5fd1005124b4c02e122756d4f79d8aa9fd6d2b03d1011c669a4cafa16f2e236539ce6014bf4b0e240d127c1d478db2a9e5bd3c33e79246ee208ae51e96142a76553bca928a7cc8e6f8619106f311ae58953272bc96cc5b0b3d0d57343775b368f031ebb11cf73a910c86aa91ab662ccd0dabbec26d656551c1fa4bdd55f72c8f24e0442a453f229633f2db01cb728f38dea94fa3d7319d0689c128eb60ca2935673df587f8c60901fd8ac0eba49510ba1b7f51198c7840524eb237c35da262718eb64918f7c39cf64e47bcdd88abd4c16b0ea220e4f598f721e8d1338422d8c77ea63eac77c7644c516d4d7118fbae442839563243684046c25a445b48d4678e5fd1005124b4c02e122756d4f79d8aa9fd6d2b03d1011c669a4cafa16f2e236539ce6014bf4b0e240d127c1d478db2a9e5bd3c33e79246ee208ae51e96142a76553bca928a7cc8e6f8619106f311ae58953272bc96cc5b0b3d0d579c98d5c9687ada34ee6a6734575ddbf685490ea50d88dafaa3fcc004ca41b7cc31119d92b7b9dadd5f7deefb3ffcc0e9b19d0ec70be4d07e8a657277bfb36bbb3e465c2c5edcfcc21c6be449dc5d67b2c774809e7103f81d3bd36900fc59bc92e935df496164acd8935a7734eb04ac979bc317d0525b7ecb835a79740d80b7d0643ddbd8bcafeaf7f12a61affbbe627f6c561545bd0edaaa1db01c90342c0cad0a25bd92447e27cd03dea84c53d4696f9e16df06d354ce2c34a26b481075eb53c0748e66c2a21425edf9dbc82c60b16dabfa788b78c7926166762df864e2288fb7db2e4deb57c23cce6e9a85524f10ee2b57df91054d00aa80155a376579caeb9c98d5c9687ada34ee6a6734575ddbf685490ea50d88dafaa3fcc004ca41b7cc31119d92b7b9dadd5f7deefb3ffcc0e9b19d0ec70be4d07e8a657277bfb36bbb3e465c2c5edcfcc21c6be449dc5d67b2c774809e7103f81d3bd36900fc59bc92e935df496164acd8935a7734eb04ac979bc317d0525b7ecb835a79740d80b7d0643ddbd8bcafeaf7f12a61affbbe627f6c561545bd0edaaa1db01c90342c0cad0a25bd92447e27cd03dea84c53d4696f9e16df06d354ce2c34a26b481075eb53c0748e66c2a21425edf9dbc82c60b16dabfa788b78c7926166762df864e2288fb7db2e4deb57c23cce6e9a85524f10ee2b57df91054d00aa80155a376579caeb',
  // 10 shares
  '0x03c2871c338c3206657ce90c00655f526a2055355bde197116efcc55de8b7bc69db23f2a78c91ccee05bd48c03f1d4903631930f49165acc5e605bcdbd1a4bcdd7b44366f2af42e4126cbffc9e34ec9fa29662a401c5aa7ebef5e4ee287c895617dc930f49165acc5e605bcdbd1a4bcdd7b44366f2af42e4126cbffc9e34ec9fa29662a401c5aa7ebef5e4ee287c895617dcaf4dd395545044ac2c83fe26548751891ac655ede78d6d346d5c1611ec39cd5b828440dddc8d5739253a272b128ea962af4dd395545044ac2c83fe26548751891ac655ede78d6d346d5c1611ec39cd5b828440dddc8d5739253a272b128ea962af4dd395545044ac2c83fe26548751891ac655ede78d6d346d5c1611ec39cd5b828440dddc8d5739253a272b128ea962af4dd395545044ac2c83fe26548751891ac655ede78d6d346d5c1611ec39cd5b828440dddc8d5739253a272b128ea962871c338c3206657ce90c00655f526a2055355bde197116efcc55de8b7bc69db23f2a78c91ccee05bd48c03f1d4903631871c338c3206657ce90c00655f526a2055355bde197116efcc55de8b7bc69db23f2a78c91ccee05bd48c03f1d4903631b7d586100b1137d7c7fc4c9b6aad63021581fcd3fa6bb55455e6eb5e42fdba1b1fe1e25b8a350c47f4904064241c034c5dc03027fb3532501eff0877819eedebeb982d651c47ccc7cecf2cc508ad3ba7dd802e993acbaf696a6dcce1eada8ad77c75fc6085a183990b6fadbfb888205b29e17a00671ce8d04b9f3dd64283c29a58ec2ea3a4f1da6227c207708024bc6243e77f41ad7c219e40e14a4b965a9e9957a44fceba379b7c0082d25446c8d3cbb5e0f81b5fea835f5277f6cb3e62df9680f182571466fdbd28585cd2571c832ce11ff9c9a1d144a505f2ff198b6ab3ba19b0ce3096967635c916be872dacefe2c5477c6da28d6a47fd49d8ecad7f161a8d69fb343ca785c795c3242639866789f8d8631693c4a5c68e5a95061e176635d39e28f9afa9a1f23b5ddaaa6212bc699982631ed39ea56134e10efd459421f4abb9a8d9881e78d538c536e0e3062dd3f0f4ac19e2bf0e8329eaf86279235e6b13507f27a3a1afb5845ffe3fe09b1865f2c9cdccd7efc2c1a45244e67cd62ea7ac5a3316e19ed019d7ba0ac6e420f303e2a951e043e7d69b98a8e0975c69c373074a69f40e423bc4787338b33fa1dc15642849a66d89be6c614c9d7372918ed3f12c8767aeda14800cdde15ed83e1df9824b71fcfe636cdb755c374a9df628a9e2f189c900b02a57306e4099b794cb42fa84dc43e186e9e10e2c786a75b32ffdeaf228a77e53b013d830ebbbbb72af84dbf2f64bd66f0584f26a38324d93ae0acb717c60daa7c947fb4cce4d1865fbbb9982631ed39ea56134e10efd459421f4abb9a8d9881e78d538c536e0e3062dd3f0f4ac19e2bf0e8329eaf86279235e6b13507f27a3a1afb5845ffe3fe09b1865f2c9cdccd7efc2c1a45244e67cd62ea7ac5a3316e19ed019d7ba0ac6e420f303e2a951e043e7d69b98a8e0975c69c373074a69f40e423bc4787338b33fa1dc15642849a66d89be6c614c9d7372918ed3f12c8767aeda14800cdde15ed83e1df9824b71fcfe636cdb755c374a9df628a9e2f189c900b02a57306e4099b794cb42fa84dc43e186e9e10e2c786a75b32ffdeaf228a77e53b013d830ebbbbb72af84dbf2f64bd66f0584f26a38324d93ae0acb717c60daa7c947fb4cce4d1865fbbb9982631ed39ea56134e10efd459421f4abb9a8d9881e78d538c536e0e3062dd3f0f4ac19e2bf0e8329eaf86279235e6b13507f27a3a1afb5845ffe3fe09b1865f2c9cdccd7efc2c1a45244e67cd62ea7ac5a3316e19ed019d7ba0ac6e420f303e2a951e043e7d69b98a8e0975c69c373074a69f40e423bc4787338b33fa1dc15642849a66d89be6c614c9d7372918ed3f12c8767aeda14800cdde15ed83e1df9824b71fcfe636cdb755c374a9df628a9e2f189c900b02a57306e4099b794cb42fa84dc43e186e9e10e2c786a75b32ffdeaf228a77e53b013d830ebbbbb72af84dbf2f64bd66f0584f26a38324d93ae0acb717c60daa7c947fb4cce4d1865fbbb343775b368f031ebb11cf73a910c86aa91ab662ccd0dabbec26d656551c1fa4bdd55f72c8f24e0442a453f229633f2db01cb728f38dea94fa3d7319d0689c128eb60ca2935673df587f8c60901fd8ac0eba49510ba1b7f51198c7840524eb237c35da262718eb64918f7c39cf64e47bcdd88abd4c16b0ea220e4f598f721e8d1338422d8c77ea63eac77c7644c516d4d7118fbae442839563243684046c25a445b48d4678e5fd1005124b4c02e122756d4f79d8aa9fd6d2b03d1011c669a4cafa16f2e236539ce6014bf4b0e240d127c1d478db2a9e5bd3c33e79246ee208ae51e96142a76553bca928a7cc8e6f8619106f311ae58953272bc96cc5b0b3d0d57343775b368f031ebb11cf73a910c86aa91ab662ccd0dabbec26d656551c1fa4bdd55f72c8f24e0442a453f229633f2db01cb728f38dea94fa3d7319d0689c128eb60ca2935673df587f8c60901fd8ac0eba49510ba1b7f51198c7840524eb237c35da262718eb64918f7c39cf64e47bcdd88abd4c16b0ea220e4f598f721e8d1338422d8c77ea63eac77c7644c516d4d7118fbae442839563243684046c25a445b48d4678e5fd1005124b4c02e122756d4f79d8aa9fd6d2b03d1011c669a4cafa16f2e236539ce6014bf4b0e240d127c1d478db2a9e5bd3c33e79246ee208ae51e96142a76553bca928a7cc8e6f8619106f311ae58953272bc96cc5b0b3d0d57343775b368f031ebb11cf73a910c86aa91ab662ccd0dabbec26d656551c1fa4bdd55f72c8f24e0442a453f229633f2db01cb728f38dea94fa3d7319d0689c128eb60ca2935673df587f8c60901fd8ac0eba49510ba1b7f51198c7840524eb237c35da262718eb64918f7c39cf64e47bcdd88abd4c16b0ea220e4f598f721e8d1338422d8c77ea63eac77c7644c516d4d7118fbae442839563243684046c25a445b48d4678e5fd1005124b4c02e122756d4f79d8aa9fd6d2b03d1011c669a4cafa16f2e236539ce6014bf4b0e240d127c1d478db2a9e5bd3c33e79246ee208ae51e96142a76553bca928a7cc8e6f8619106f311ae58953272bc96cc5b0b3d0d57343775b368f031ebb11cf73a910c86aa91ab662ccd0dabbec26d656551c1fa4bdd55f72c8f24e0442a453f229633f2db01cb728f38dea94fa3d7319d0689c128eb60ca2935673df587f8c60901fd8ac0eba49510ba1b7f51198c7840524eb237c35da262718eb64918f7c39cf64e47bcdd88abd4c16b0ea220e4f598f721e8d1338422d8c77ea63eac77c7644c516d4d7118fbae442839563243684046c25a445b48d4678e5fd1005124b4c02e122756d4f79d8aa9fd6d2b03d1011c669a4cafa16f2e236539ce6014bf4b0e240d127c1d478db2a9e5bd3c33e79246ee208ae51e96142a76553bca928a7cc8e6f8619106f311ae58953272bc96cc5b0b3d0d579c98d5c9687ada34ee6a6734575ddbf685490ea50d88dafaa3fcc004ca41b7cc31119d92b7b9dadd5f7deefb3ffcc0e9b19d0ec70be4d07e8a657277bfb36bbb3e465c2c5edcfcc21c6be449dc5d67b2c774809e7103f81d3bd36900fc59bc92e935df496164acd8935a7734eb04ac979bc317d0525b7ecb835a79740d80b7d0643ddbd8bcafeaf7f12a61affbbe627f6c561545bd0edaaa1db01c90342c0cad0a25bd92447e27cd03dea84c53d4696f9e16df06d354ce2c34a26b481075eb53c0748e66c2a21425edf9dbc82c60b16dabfa788b78c7926166762df864e2288fb7db2e4deb57c23cce6e9a85524f10ee2b57df91054d00aa80155a376579caeb9c98d5c9687ada34ee6a6734575ddbf685490ea50d88dafaa3fcc004ca41b7cc31119d92b7b9dadd5f7deefb3ffcc0e9b19d0ec70be4d07e8a657277bfb36bbb3e465c2c5edcfcc21c6be449dc5d67b2c774809e7103f81d3bd36900fc59bc92e935df496164acd8935a7734eb04ac979bc317d0525b7ecb835a79740d80b7d0643ddbd8bcafeaf7f12a61affbbe627f6c561545bd0edaaa1db01c90342c0cad0a25bd92447e27cd03dea84c53d4696f9e16df06d354ce2c34a26b481075eb53c0748e66c2a21425edf9dbc82c60b16dabfa788b78c7926166762df864e2288fb7db2e4deb57c23cce6e9a85524f10ee2b57df91054d00aa80155a376579caeb',
  // 13 shares
  '0x04e2871c338c3206657ce90c00655f526a2055355bde197116efcc55de8b7bc69db23f2a78c91ccee05bd48c03f1d4903631930f49165acc5e605bcdbd1a4bcdd7b44366f2af42e4126cbffc9e34ec9fa29662a401c5aa7ebef5e4ee287c895617dc930f49165acc5e605bcdbd1a4bcdd7b44366f2af42e4126cbffc9e34ec9fa29662a401c5aa7ebef5e4ee287c895617dc930f49165acc5e605bcdbd1a4bcdd7b44366f2af42e4126cbffc9e34ec9fa29662a401c5aa7ebef5e4ee287c895617dcaf4dd395545044ac2c83fe26548751891ac655ede78d6d346d5c1611ec39cd5b828440dddc8d5739253a272b128ea962af4dd395545044ac2c83fe26548751891ac655ede78d6d346d5c1611ec39cd5b828440dddc8d5739253a272b128ea962af4dd395545044ac2c83fe26548751891ac655ede78d6d346d5c1611ec39cd5b828440dddc8d5739253a272b128ea962af4dd395545044ac2c83fe26548751891ac655ede78d6d346d5c1611ec39cd5b828440dddc8d5739253a272b128ea962af4dd395545044ac2c83fe26548751891ac655ede78d6d346d5c1611ec39cd5b828440dddc8d5739253a272b128ea962871c338c3206657ce90c00655f526a2055355bde197116efcc55de8b7bc69db23f2a78c91ccee05bd48c03f1d4903631871c338c3206657ce90c00655f526a2055355bde197116efcc55de8b7bc69db23f2a78c91ccee05bd48c03f1d4903631871c338c3206657ce90c00655f526a2055355bde197116efcc55de8b7bc69db23f2a78c91ccee05bd48c03f1d4903631b7d586100b1137d7c7fc4c9b6aad63021581fcd3fa6bb55455e6eb5e42fdba1b1fe1e25b8a350c47f4904064241c034c5dc03027fb3532501eff0877819eedebeb982d651c47ccc7cecf2cc508ad3ba7dd802e993acbaf696a6dcce1eada8ad77c75fc6085a183990b6fadbfb888205b29e17a00671ce8d04b9f3dd64283c29a58ec2ea3a4f1da6227c207708024bc6243e77f41ad7c219e40e14a4b965a9e9957a44fceba379b7c0082d25446c8d3cbb5e0f81b5fea835f5277f6cb3e62df9680f182571466fdbd28585cd2571c832ce11ff9c9a1d144a505f2ff198b6ab3ba19b0ce3096967635c916be872dacefe2c5477c6da28d6a47fd49d8ecad7f161a8d69fb343ca785c795c3242639866789f8d8631693c4a5c68e5a95061e176635d39e28f9afa9a1f23b5ddaaa6212bc699982631ed39ea56134e10efd459421f4abb9a8d9881e78d538c536e0e3062dd3f0f4ac19e2bf0e8329eaf86279235e6b13507f27a3a1afb5845ffe3fe09b1865f2c9cdccd7efc2c1a45244e67cd62ea7ac5a3316e19ed019d7ba0ac6e420f303e2a951e043e7d69b98a8e0975c69c373074a69f40e423bc4787338b33fa1dc15642849a66d89be6c614c9d7372918ed3f12c8767aeda14800cdde15ed83e1df9824b71fcfe636cdb755c374a9df628a9e2f189c900b02a57306e4099b794cb42fa84dc43e186e9e10e2c786a75b32ffdeaf228a77e53b013d830ebbbbb72af84dbf2f64bd66f0584f26a38324d93ae0acb717c60daa7c947fb4cce4d1865fbbb9982631ed39ea56134e10efd459421f4abb9a8d9881e78d538c536e0e3062dd3f0f4ac19e2bf0e8329eaf86279235e6b13507f27a3a1afb5845ffe3fe09b1865f2c9cdccd7efc2c1a45244e67cd62ea7ac5a3316e19ed019d7ba0ac6e420f303e2a951e043e7d69b98a8e0975c69c373074a69f40e423bc4787338b33fa1dc15642849a66d89be6c614c9d7372918ed3f12c8767aeda14800cdde15ed83e1df9824b71fcfe636cdb755c374a9df628a9e2f189c900b02a57306e4099b794cb42fa84dc43e186e9e10e2c786a75b32ffdeaf228a77e53b013d830ebbbbb72af84dbf2f64bd66f0584f26a38324d93ae0acb717c60daa7c947fb4cce4d1865fbbb9982631ed39ea56134e10efd459421f4abb9a8d9881e78d538c536e0e3062dd3f0f4ac19e2bf0e8329eaf86279235e6b13507f27a3a1afb5845ffe3fe09b1865f2c9cdccd7efc2c1a45244e67cd62ea7ac5a3316e19ed019d7ba0ac6e420f303e2a951e043e7d69b98a8e0975c69c373074a69f40e423bc4787338b33fa1dc15642849a66d89be6c614c9d7372918ed3f12c8767aeda14800cdde15ed83e1df9824b71fcfe636cdb755c374a9df628a9e2f189c900b02a57306e4099b794cb42fa84dc43e186e9e10e2c786a75b32ffdeaf228a77e53b013d830ebbbbb72af84dbf2f64bd66f0584f26a38324d93ae0acb717c60daa7c947fb4cce4d1865fbbb9982631ed39ea56134e10efd459421f4abb9a8d9881e78d538c536e0e3062dd3f0f4ac19e2bf0e8329eaf86279235e6b13507f27a3a1afb5845ffe3fe09b1865f2c9cdccd7efc2c1a45244e67cd62ea7ac5a3316e19ed019d7ba0ac6e420f303e2a951e043e7d69b98a8e0975c69c373074a69f40e423bc4787338b33fa1dc15642849a66d89be6c614c9d7372918ed3f12c8767aeda14800cdde15ed83e1df9824b71fcfe636cdb755c374a9df628a9e2f189c900b02a57306e4099b794cb42fa84dc43e186e9e10e2c786a75b32ffdeaf228a77e53b013d830ebbbbb72af84dbf2f64bd66f0584f26a38324d93ae0acb717c60daa7c947fb4cce4d1865fbbb343775b368f031ebb11cf73a910c86aa91ab662ccd0dabbec26d656551c1fa4bdd55f72c8f24e0442a453f229633f2db01cb728f38dea94fa3d7319d0689c128eb60ca2935673df587f8c60901fd8ac0eba49510ba1b7f51198c7840524eb237c35da262718eb64918f7c39cf64e47bcdd88abd4c16b0ea220e4f598f721e8d1338422d8c77ea63eac77c7644c516d4d7118fbae442839563243684046c25a445b48d4678e5fd1005124b4c02e122756d4f79d8aa9fd6d2b03d1011c669a4cafa16f2e236539ce6014bf4b0e240d127c1d478db2a9e5bd3c33e79246ee208ae51e96142a76553bca928a7cc8e6f8619106f311ae58953272bc96cc5b0b3d0d57343775b368f031ebb11cf73a910c86aa91ab662ccd0dabbec26d656551c1fa4bdd55f72c8f24e0442a453f229633f2db01cb728f38dea94fa3d7319d0689c128eb60ca2935673df587f8c60901fd8ac0eba49510ba1b7f51198c7840524eb237c35da262718eb64918f7c39cf64e47bcdd88abd4c16b0ea220e4f598f721e8d1338422d8c77ea63eac77c7644c516d4d7118fbae442839563243684046c25a445b48d4678e5fd1005124b4c02e122756d4f79d8aa9fd6d2b03d1011c669a4cafa16f2e236539ce6014bf4b0e240d127c1d478db2a9e5bd3c33e79246ee208ae51e96142a76553bca928a7cc8e6f8619106f311ae58953272bc96cc5b0b3d0d57343775b368f031ebb11cf73a910c86aa91ab662ccd0dabbec26d656551c1fa4bdd55f72c8f24e0442a453f229633f2db01cb728f38dea94fa3d7319d0689c128eb60ca2935673df587f8c60901fd8ac0eba49510ba1b7f51198c7840524eb237c35da262718eb64918f7c39cf64e47bcdd88abd4c16b0ea220e4f598f721e8d1338422d8c77ea63eac77c7644c516d4d7118fbae442839563243684046c25a445b48d4678e5fd1005124b4c02e122756d4f79d8aa9fd6d2b03d1011c669a4cafa16f2e236539ce6014bf4b0e240d127c1d478db2a9e5bd3c33e79246ee208ae51e96142a76553bca928a7cc8e6f8619106f311ae58953272bc96cc5b0b3d0d57343775b368f031ebb11cf73a910c86aa91ab662ccd0dabbec26d656551c1fa4bdd55f72c8f24e0442a453f229633f2db01cb728f38dea94fa3d7319d0689c128eb60ca2935673df587f8c60901fd8ac0eba49510ba1b7f51198c7840524eb237c35da262718eb64918f7c39cf64e47bcdd88abd4c16b0ea220e4f598f721e8d1338422d8c77ea63eac77c7644c516d4d7118fbae442839563243684046c25a445b48d4678e5fd1005124b4c02e122756d4f79d8aa9fd6d2b03d1011c669a4cafa16f2e236539ce6014bf4b0e240d127c1d478db2a9e5bd3c33e79246ee208ae51e96142a76553bca928a7cc8e6f8619106f311ae58953272bc96cc5b0b3d0d57343775b368f031ebb11cf73a910c86aa91ab662ccd0dabbec26d656551c1fa4bdd55f72c8f24e0442a453f229633f2db01cb728f38dea94fa3d7319d0689c128eb60ca2935673df587f8c60901fd8ac0eba49510ba1b7f51198c7840524eb237c35da262718eb64918f7c39cf64e47bcdd88abd4c16b0ea220e4f598f721e8d1338422d8c77ea63eac77c7644c516d4d7118fbae442839563243684046c25a445b48d4678e5fd1005124b4c02e122756d4f79d8aa9fd6d2b03d1011c669a4cafa16f2e236539ce6014bf4b0e240d127c1d478db2a9e5bd3c33e79246ee208ae51e96142a76553bca928a7cc8e6f8619106f311ae58953272bc96cc5b0b3d0d579c98d5c9687ada34ee6a6734575ddbf685490ea50d88dafaa3fcc004ca41b7cc31119d92b7b9dadd5f7deefb3ffcc0e9b19d0ec70be4d07e8a657277bfb36bbb3e465c2c5edcfcc21c6be449dc5d67b2c774809e7103f81d3bd36900fc59bc92e935df496164acd8935a7734eb04ac979bc317d0525b7ecb835a79740d80b7d0643ddbd8bcafeaf7f12a61affbbe627f6c561545bd0edaaa1db01c90342c0cad0a25bd92447e27cd03dea84c53d4696f9e16df06d354ce2c34a26b481075eb53c0748e66c2a21425edf9dbc82c60b16dabfa788b78c7926166762df864e2288fb7db2e4deb57c23cce6e9a85524f10ee2b57df91054d00aa80155a376579caeb9c98d5c9687ada34ee6a6734575ddbf685490ea50d88dafaa3fcc004ca41b7cc31119d92b7b9dadd5f7deefb3ffcc0e9b19d0ec70be4d07e8a657277bfb36bbb3e465c2c5edcfcc21c6be449dc5d67b2c774809e7103f81d3bd36900fc59bc92e935df496164acd8935a7734eb04ac979bc317d0525b7ecb835a79740d80b7d0643ddbd8bcafeaf7f12a61affbbe627f6c561545bd0edaaa1db01c90342c0cad0a25bd92447e27cd03dea84c53d4696f9e16df06d354ce2c34a26b481075eb53c0748e66c2a21425edf9dbc82c60b16dabfa788b78c7926166762df864e2288fb7db2e4deb57c23cce6e9a85524f10ee2b57df91054d00aa80155a376579caeb9c98d5c9687ada34ee6a6734575ddbf685490ea50d88dafaa3fcc004ca41b7cc31119d92b7b9dadd5f7deefb3ffcc0e9b19d0ec70be4d07e8a657277bfb36bbb3e465c2c5edcfcc21c6be449dc5d67b2c774809e7103f81d3bd36900fc59bc92e935df496164acd8935a7734eb04ac979bc317d0525b7ecb835a79740d80b7d0643ddbd8bcafeaf7f12a61affbbe627f6c561545bd0edaaa1db01c90342c0cad0a25bd92447e27cd03dea84c53d4696f9e16df06d354ce2c34a26b481075eb53c0748e66c2a21425edf9dbc82c60b16dabfa788b78c7926166762df864e2288fb7db2e4deb57c23cce6e9a85524f10ee2b57df91054d00aa80155a376579caeb'
];

export const DataGenerator = {
  publicKey: (index: number) => `0x${index.toString(16).padStart(96, '0')}`,
  shares: (index: number) => {
    switch (index) {
      case 7:
        return SHARES_RSA[1];
      case 10:
        return SHARES_RSA[2];
      case 13:
        return SHARES_RSA[3];
      default:
        return SHARES_RSA[0];
    }
  },
  cluster: {
    new: (size = 4) => {
      const usedOperatorIds: any = {};
      for (const clusterId in DB.clusters) {
        for (const operatorId of DB.clusters[clusterId].operatorIds) {
          usedOperatorIds[operatorId] = true;
        }
      }

      const result = [];
      for (const operator of DB.operators) {
        if (operator && !usedOperatorIds[operator.operatorId]) {
          result.push(operator.operatorId);
          usedOperatorIds[operator.operatorId] = true;

          if (result.length == size) {
            break;
          }
        }
      }
      if (result.length < size) {
        throw new Error('No new clusters. Try to register more operators.');
      }
      return result;
    },
    byId: (id: any) => DB.clusters[id].operatorIds
  }
};

export const initializeContract = async () => {
  CONFIG = {
    initialVersion: "0.0.1",
    operatorMaxFeeIncrease: 1000,
    declareOperatorFeePeriod: 3600, // HOUR
    executeOperatorFeePeriod: 86400, // DAY
    minimalOperatorFee: 100000000,
    minimalBlocksBeforeLiquidation: 100800,
    minimumLiquidationCollateral: 200000000,
    validatorsPerOperatorLimit: 500
  };

  DB = {
    owners: [],
    validators: [],
    operators: [],
    clusters: [],
    ssvNetwork: {},
    ssvViews: {},
    ssvToken: {},
    registerAuth: {}
  };

  // Define accounts
  DB.owners = await ethers.getSigners();

  // Initialize contract
  const ssvNetwork = await ethers.getContractFactory('SSVNetwork');
  const ssvViews = await ethers.getContractFactory('SSVNetworkViews');
  const ssvToken = await ethers.getContractFactory('SSVTokenMock');
  const registerAuth = await ethers.getContractFactory('RegisterAuth');

  DB.ssvToken = await ssvToken.deploy();
  await DB.ssvToken.deployed();

  DB.registerAuth.contract = await upgrades.deployProxy(registerAuth, [],
    {
      kind: 'uups'
    });

  await DB.registerAuth.contract.deployed();

  console.log("auth deployed")

  DB.ssvNetwork.contract = await upgrades.deployProxy(ssvNetwork, [
    CONFIG.initialVersion,
    DB.ssvToken.address,
    CONFIG.operatorMaxFeeIncrease,
    CONFIG.declareOperatorFeePeriod,
    CONFIG.executeOperatorFeePeriod,
    CONFIG.minimalBlocksBeforeLiquidation,
    CONFIG.minimumLiquidationCollateral,
    CONFIG.validatorsPerOperatorLimit
  ],
    {
      kind: 'uups',
      unsafeAllow: ['state-variable-immutable', 'constructor'],
      constructorArgs: [DB.registerAuth.contract.address]
    });

  await DB.ssvNetwork.contract.deployed();

  console.log("ssv network deployed")

  await DB.registerAuth.contract.setAuth(DB.owners[0].address, [true, true]);

  DB.ssvViews.contract = await upgrades.deployProxy(ssvViews, [
    DB.ssvNetwork.contract.address
  ],
    {
      kind: 'uups'
    });

  await DB.ssvViews.contract.deployed();

  DB.ssvNetwork.owner = DB.owners[0];

  console.log("minting")

  await DB.ssvToken.mint(DB.owners[1].address, '10000000000000000000');
  await DB.ssvToken.mint(DB.owners[2].address, '10000000000000000000');
  await DB.ssvToken.mint(DB.owners[3].address, '10000000000000000000');
  await DB.ssvToken.mint(DB.owners[4].address, '10000000000000000000');
  await DB.ssvToken.mint(DB.owners[5].address, '10000000000000000000');
  await DB.ssvToken.mint(DB.owners[6].address, '10000000000000000000');

  return { contract: DB.ssvNetwork.contract, owner: DB.ssvNetwork.owner, ssvToken: DB.ssvToken, ssvViews: DB.ssvViews.contract, registerAuth: DB.registerAuth.contract };
};

export const registerOperators = async (ownerId: number, numberOfOperators: number, fee: string, gasGroups: GasGroup[] = [GasGroup.REGISTER_OPERATOR]) => {
  await DB.registerAuth.contract.setAuth(DB.owners[ownerId].address, [true, false]);
  for (let i = 0; i < numberOfOperators; ++i) {
    const { eventsByName } = await trackGas(
      DB.ssvNetwork.contract.connect(DB.owners[ownerId]).registerOperator(DataGenerator.publicKey(i), fee),
      gasGroups
    );
    const event = eventsByName.OperatorAdded[0];
    DB.operators[event.args.operatorId] = {
      operatorId: event.args.operatorId, ownerId: ownerId, publicKey: DataGenerator.publicKey(i)
    };
  }
};

export const deposit = async (ownerId: number, ownerAddress: string, operatorIds: number[], amount: string, cluster: any) => {
  await DB.ssvToken.connect(DB.owners[ownerId]).approve(DB.ssvNetwork.contract.address, amount);
  const depositedCluster = await trackGas(DB.ssvNetwork.contract.connect(DB.owners[ownerId]).deposit(
    ownerAddress,
    operatorIds,
    amount,
    cluster));
  return depositedCluster.eventsByName.ClusterDeposited[0].args;
};

export const liquidate = async (ownerAddress: string, operatorIds: number[], cluster: any) => {
  const liquidatedCluster = await trackGas(DB.ssvNetwork.contract.liquidate(
    ownerAddress,
    operatorIds,
    cluster
  ));
  return liquidatedCluster.eventsByName.ClusterLiquidated[0].args;
};

export const removeValidator = async (ownerId: number, pk: string, operatorIds: number[], cluster: any) => {
  const removedValidator = await trackGas(DB.ssvNetwork.contract.connect(DB.owners[ownerId]).removeValidator(
    pk,
    operatorIds,
    cluster
  ));
  return removedValidator.eventsByName.ValidatorRemoved[0].args;
};

export const withdraw = async (ownerId: number, operatorIds: number[], amount: string, cluster: any) => {
  const withdrawnCluster = await trackGas(DB.ssvNetwork.contract.connect(DB.owners[ownerId]).withdraw(
    operatorIds,
    amount,
    cluster));

  return withdrawnCluster.eventsByName.ClusterWithdrawn[0].args;
};

export const reactivate = async (ownerId: number, operatorIds: number[], amount: string, cluster: any) => {
  await DB.ssvToken.connect(DB.owners[ownerId]).approve(DB.ssvNetwork.contract.address, amount);
  const reactivatedCluster = await trackGas(DB.ssvNetwork.contract.connect(DB.owners[ownerId]).reactivate(
    operatorIds,
    amount,
    cluster));
  return reactivatedCluster.eventsByName.ClusterReactivated[0].args;
};

export const registerValidators = async (ownerId: number, numberOfValidators: number, amount: string, operatorIds: number[], gasGroups?: GasGroup[]) => {
  await DB.registerAuth.contract.setAuth(DB.owners[ownerId].address, [false, true]);
  const validators: any = [];
  let args: any;
  // Register validators to contract
  for (let i = 0; i < numberOfValidators; i++) {
    const publicKey = DataGenerator.publicKey(DB.validators.length ? DB.validators.length + 1 : 1);
    const shares = DataGenerator.shares(DB.validators.length);
    await DB.ssvToken.connect(DB.owners[ownerId]).approve(DB.ssvNetwork.contract.address, amount);
    const result = await trackGas(DB.ssvNetwork.contract.connect(DB.owners[ownerId]).registerValidator(
      publicKey,
      operatorIds,
      shares,
      amount,
      {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true
      }
    ), gasGroups);
    args = result.eventsByName.ValidatorAdded[0].args;
    DB.validators.push({ publicKey, operatorIds, shares });
    validators.push({ publicKey, shares });
  }

  return { validators, args };
};

export const registerValidatorsRaw = async (ownerId: number, numberOfValidators: number, amount: string, operatorIds: number[], gasGroups?: GasGroup[]) => {
  await DB.registerAuth.contract.setAuth(DB.owners[ownerId].address, [false, true]);

  let cluster: any = {
    validatorCount: 0,
    networkFeeIndex: 0,
    index: 0,
    balance: 0,
    active: true
  };

  for (let i = 1; i <= numberOfValidators; i++) {

    const shares = DataGenerator.shares(4);
    const publicKey = DataGenerator.publicKey(i);

    await DB.ssvToken.connect(DB.owners[ownerId]).approve(DB.ssvNetwork.contract.address, amount);
    const result = await trackGas(DB.ssvNetwork.contract.connect(DB.owners[ownerId]).registerValidator(
      publicKey,
      operatorIds,
      shares,
      amount,
      cluster
    ), gasGroups);
    cluster = result.eventsByName.ValidatorAdded[0].args.cluster;
  }
}


export const getCluster = (payload: any) => ethers.utils.AbiCoder.prototype.encode(
  ['tuple(uint32 validatorCount, uint64 networkFee, uint64 networkFeeIndex, uint64 index, uint64 balance, bool active) cluster'],
  [payload]
);

export const coldRegisterValidator = async () => {
  await DB.registerAuth.contract.setAuth(DB.owners[0].address, [false, true]);

  await DB.ssvToken.approve(DB.ssvNetwork.contract.address, '1000000000000000');
  await DB.ssvNetwork.contract.registerValidator(
    DataGenerator.publicKey(90),
    [1, 2, 3, 4],
    DataGenerator.shares(4),
    '1000000000000000',
    {
      validatorCount: 0,
      networkFeeIndex: 0,
      index: 0,
      balance: 0,
      active: true
    }
  );
};

/*
export const transferValidator = async (ownerId: number, publicKey: string, operatorIds: number[], amount: string, gasGroups?: GasGroup[]) => {
  // let clusterId: any;
  const shares = DataGenerator.shares(DB.validators.length);

  // Transfer validator
  await trackGas(DB.ssvNetwork.contract.connect(DB.owners[ownerId]).transferValidator(
    publicKey,
    (await registerClusterAndDeposit(ownerId, operatorIds, amount)).clusterId,
    shares,
  ), gasGroups);

  // FOR ADAM TO UPDATE
  // clusterId = eventsByName.ValidatorTransferred[0].args.clusterId;
  // DB.clusters[clusterId] = ({ id: clusterId, operatorIds });
  // DB.validators[publicKey].clusterId = clusterId;
  // DB.validators[publicKey].shares = shares;

  // return { clusterId };
};


export const bulkTransferValidator = async (ownerId: number, publicKey: string[], fromCluster: string, toCluster: string, amount: string, gasGroups?: GasGroup[]) => {
  const shares = Array(publicKey.length).fill(DataGenerator.shares(0));

  await registerClusterAndDeposit(ownerId, DataGenerator.cluster.byId(toCluster), amount);

  // Bulk transfer validators
  await trackGas(DB.ssvNetwork.contract.connect(DB.owners[ownerId]).bulkTransferValidators(
    publicKey,
    fromCluster,
    toCluster,
    shares,
  ), gasGroups);

  // FOR ADAM TO UPDATE
  // clusterId = eventsByName.ValidatorTransferred[0].args.clusterId;
  // DB.clusters[clusterId] = ({ id: clusterId, operatorIds });
  // DB.validators[publicKey].clusterId = clusterId;
  // DB.validators[publicKey].shares = shares;

  // return { clusterId };
};

export const liquidate = async (executorOwnerId: number, liquidatedOwnerId: number, operatorIds: number[], gasGroups?: GasGroup[]) => {
  const { eventsByName } = await trackGas(DB.ssvNetwork.contract.connect(DB.owners[executorOwnerId]).liquidate(
    DB.owners[liquidatedOwnerId].address,
    await DB.ssvNetwork.contract.getCluster(operatorIds),
  ), gasGroups);

  const clusterId = eventsByName.AccountLiquidated[0].args.clusterId;
  return { clusterId };
};
*/
