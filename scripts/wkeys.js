// const { ethers, getChainId} = require('hardhat');
const EthCrypto = require('eth-crypto');
const ethers = require('ethers');

const main = async () => {


    let mnemonic = "race uphold carpet label stereo attack diet blush evil mother giggle buzz";
    let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
    console.log(mnemonicWallet.privateKey);



    // let chainID = await getChainId();
    // let accounts = await ethers.getSigners()
    // let deployer = accounts[0];
    // console.log("chainID is :" + chainID + " address :" + deployer.address);

    // // let privateKeyList = [
    // //     "0xc03b0a988e2e18794f2f0e881d7ffcd340d583f63c1be078426ae09ddbdec9f5",
    // //     "0x54e6e01600b66af71b9827429ff32599383d7694684bc09e26c3b13d95980650",
    // //     "0xcb93f47f4ae6e2ee722517f3a2d3e7f55a5074f430c9860bcfe1d6d172492ed0"
    // // ]
    // // let privateKeyList = [
    // //     "41f8a791476092cb3bbd632dcbf5217ff0f6107bc76e322f8159a1fb63d9670d",
    // //     "0x54e6e01600b66af71b9827429ff32599383d7694684bc09e26c3b13d95980650",
    // //     "0xcb93f47f4ae6e2ee722517f3a2d3e7f55a5074f430c9860bcfe1d6d172492ed0"
    // // ]
    // // let pubkeyList = [],addressList = [];

    // // for(var i = 0 ;i < privateKeyList.length ;i ++){

    // //     const publicKey = EthCrypto.publicKeyByPrivateKey(privateKeyList[i]);
    // //     const publicKeyCompressed = EthCrypto.publicKey.compress(publicKey);
    // //     pubkeyList.push(publicKeyCompressed);

    // //     const address = EthCrypto.publicKey.toAddress(publicKey);
    // //     addressList.push(address);
    // // }
    
    // // console.log(pubkeyList);
    // // console.log(addressList);
    // EthCrypto.decryptWithPrivateKey

    // const address = EthCrypto.publicKey.toAddress("03585451831671d32c12da70f009adb6e423dfbfdd012368d9038c8b896918a62a");
    // console.log(address);
    
    //addressList.push(address);

    
}


main();
