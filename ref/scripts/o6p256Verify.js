
const { ethers, getChainId} = require('hardhat')

const {
    readConfig
} = require('./helper')

const main = async () => {

    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    const arbiter = await ethers.getContractFactory('Arbiter',deployer)

    let arbiterAddress = await readConfig("2","ARBITER_ADDRESS");
    const arbiterContract = await arbiter.connect(deployer).attach(arbiterAddress)
    
    //function p256_verify(string pubkey, string data, string sig) public view returns(bool) {
    const pubkey = "03585451831671d32c12da70f009adb6e423dfbfdd012368d9038c8b896918a62a"
    const data = "c92bff31c5b9aa77263a552d1363e2b8766bb9e3e1e666dbe80e0a52ac61b54cf453a65736d84f0da1c4c725ca8918af1bf4a1f76f48da59899f3cc5d3cdc610"
    const signature = "db3394de605f6e7ec4ef0098cf0f713672c303b06831102839d3bd02f1bcc12cf4d1265594ebee2a52eb6cf0eb6a528974973650936385cc5d7a7c37ac204b5c"

    let result = await arbiterContract.p256_verify(pubkey,data,signature);

    console.log("verify result :",result);
    
    
}



main();
