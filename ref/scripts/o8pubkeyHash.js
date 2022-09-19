const { ethers, getChainId} = require('hardhat');
const Web3 = require('web3');

const {
    sleep,
    readConfig
} = require('./helper')

const main = async () => {

    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];

    console.log("chainID is :" + chainID + " address :" + deployer.address);

    //console.log(Web3);
    let pubkeys = [
        "0x0277677f2e5a5b79c00be32027d0cde3746df316158fdacf875d37254a2afab225",
        "0x025ad78a42eb632e960ecb7e30ae7e020f5670b87586f3e136415926ecb25c5c6e",
        "0x0226875dbe2acff5ec9646c5fe590a515bc78ed087a253eba9c5efa58b2c983702"
    ]

    for(var i = 0 ;i < pubkeys.length ;i ++){
        let resultHash = Web3.utils.sha3(pubkeys[i]);
        console.log("xxl result sha3",i,resultHash);
    }


    // let arbiter0 = await arbiterContract.getArbiter0();
    // console.log("arbiter0 ",arbiter0);
}



main();
