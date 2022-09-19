
const { ethers, getChainId} = require('hardhat')
const { readConfig,isTxSuccess} = require('./helper')

const main = async () => {

    console.log("6 get arbiter list ....");

    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    const CallbackTest__Contract = await ethers.getContractFactory('CallbackTest',deployer)

    let callbackTestAddress = await readConfig("6","CALLBACK_ADDRESS");
    console.log("xxl callback Test Address :",callbackTestAddress);
    
    let callbackTest = await CallbackTest__Contract.connect(deployer).attach(callbackTestAddress);
    
    let resultData = await callbackTest.data();
    console.log("xxl result data ",resultData);

}



main();
