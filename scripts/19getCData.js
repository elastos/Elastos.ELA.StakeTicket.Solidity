
const { ethers, getChainId} = require('hardhat')
const { readConfig,isTxSuccess} = require('./helper')
const { hex2a } = require('./helper')

const main = async () => {

    console.log("19 get data ....");

    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    const DataConsumer__Contract = await ethers.getContractFactory('DataConsumer',deployer)

    let DataConsumerAddress = await readConfig("5","DATACONSUMER_ADDRESS");
    //console.log("xxl callback Test Address :",DataConsumerAddress);
    
    let DataConsumer = await DataConsumer__Contract.connect(deployer).attach(DataConsumerAddress);
    let resultData = await DataConsumer.data();
    console.log("xxl result data ",hex2a(resultData));

}



main();
