
const { ethers, getChainId} = require('hardhat')
const { readConfig } = require('./helper')

const main = async () => {

    console.log("xxl deploy data consumer ....");

    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    const DataConsumer__Contract = await ethers.getContractFactory('DataConsumer',deployer)
    let dataConsumerAddress = await readConfig("5","DATACONSUMER_ADDRESS");

    dataConsumer = await DataConsumer__Contract.connect(deployer).attach(dataConsumerAddress);
   
    let testIndex = await dataConsumer.testIndex();
    console.log("reuslt : ",testIndex.toString());
    let searchData = await dataConsumer.getSearchResult();
    console.log(searchData);

    //console.log("didData : ",testBytes);
    // console.log("dataStr : ",dataStr);
    // console.log("testByte : ",testByte);
    // console.log("dataLen : ",dataLen);
}



main();
