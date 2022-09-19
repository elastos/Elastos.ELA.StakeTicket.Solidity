
const { ethers, getChainId} = require('hardhat')
const { writeConfig,isTxSuccess} = require('./helper')

const main = async () => {

    console.log("7 request Ethereum Post ....");

    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    const CallbackTest__Contract = await ethers.getContractFactory('CallbackTest',deployer)
    const CallbackTest = await CallbackTest__Contract.connect(deployer).deploy({
        gasPrice: 0x02540be400,
        gasLimit: 0x7a1200
    });
    console.log("callbackTest address is ",CallbackTest.address);
    await writeConfig("5","6","CALLBACK_ADDRESS",CallbackTest.address);
    

}



main();
