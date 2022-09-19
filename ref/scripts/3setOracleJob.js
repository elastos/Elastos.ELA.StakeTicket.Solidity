
const { ethers, getChainId} = require('hardhat')

const {
    sleep,
    readConfig
} = require('./helper')

const main = async () => {

    try{

        console.log("xxl set Oralce And JobId ....");

        let chainID = await getChainId();
        let accounts = await ethers.getSigners()
        let deployer = accounts[0];
        console.log("chainID is :" + chainID + " address :" + deployer.address);

        const DataConsumer__Contract = await ethers.getContractFactory('DataConsumer',deployer)

        let jobId = await readConfig("2","JOB_ID");
        let oralceAddress = await readConfig("2","ORACLE_ADDRESS");
        let dataConsumerAddress = await readConfig("2","DATACONSUMER_ADDRESS");

        console.log("xxl 111 : ",[jobId,oralceAddress,dataConsumerAddress]);
        
        let dataConsumer = await DataConsumer__Contract.connect(deployer).attach(dataConsumerAddress);

        let obj = await dataConsumer.setOralceAndJobId(oralceAddress,jobId);

        let rep = await obj.wait();
        console.log(rep);

        await sleep(5000);

        // console.log("xxl dataConsumer",dataConsumer);
        let resultObj = await dataConsumer.getOralceAndJobs();
        console.log(resultObj);
    }catch(e){
        console.log("xxl e",e);
    }

}



main();
