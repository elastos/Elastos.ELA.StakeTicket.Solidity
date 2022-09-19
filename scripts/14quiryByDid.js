
const { ethers, getChainId} = require('hardhat')
const { readConfig,isTxSuccess} = require('./helper')

const main = async () => {

    console.log("13 request Ethereum Post ....");

    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    const CallbackTest__Contract = await ethers.getContractFactory('CallbackTest',deployer)
    let callbackTestAddress = await readConfig("6","CALLBACK_ADDRESS");
    let dataConsumerAddress = await readConfig("6","DATACONSUMER_ADDRESS");
    console.log("xxl callback TestAddress ",callbackTestAddress,dataConsumerAddress);

    let callbackTest = await CallbackTest__Contract.connect(deployer).attach(callbackTestAddress);
    
    let resultObj = await callbackTest.quiryByDid(
        "iqpcQKggxJDGSFbXwhFxs7ySpyJBnfZsDJ",
        dataConsumerAddress,
        {gasPrice: 0x02540be400,gasLimit: 0x7a1200}
    );

    let isOK = await isTxSuccess(resultObj)
    console.log("call consume result : ",isOK);


}



main();
