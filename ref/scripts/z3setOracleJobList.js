
const { ethers, getChainId} = require('hardhat')
const { providers,Wallet,utils} = require('ethers')

const {
    writeConfig,
    readConfig
} = require('./helper')

const main = async () => {


    console.log("xxl deploy data consumer ....");

    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    const DataConsumer__Contract = await ethers.getContractFactory('DataConsumer',deployer)


    let jobIdList = await readConfig("0","JOB_ID_LIST");
    let oralceAddressList = await readConfig("0","ORACLE_ADDRESS_LIST");
    let dataConsumerAddress = await readConfig("2","DATACONSUMER_ADDRESS");
    dataConsumer = await DataConsumer__Contract.connect(deployer).attach(dataConsumerAddress);

    let length = jobIdList.length;
    console.log(length);

    for(var i = 0 ;i < length ;i ++){
        console.log(oralceAddressList[i]);
        console.log(jobIdList[i]);

        await dataConsumer.setOralceAndJobId(oralceAddressList[i],jobIdList[i]);
    }

    

    //let txObj = await dataConsumer.requestEthereumPrice(oralceAddress,jobId);

    // let rep = await txObj.wait();
    // console.log(rep);

}



main();
