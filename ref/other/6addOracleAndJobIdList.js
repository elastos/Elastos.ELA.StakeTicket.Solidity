
const { ethers, getChainId} = require('hardhat')
const { readConfig,isTxSuccess} = require('../../scripts/helper')

const main = async () => {

    console.log("6 request Ethereum Post ....");
    let jobId = "b81641cd2e9146f9a5b0f810d7f21819";
    
    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    const DataConsumer__Contract = await ethers.getContractFactory('DataConsumer',deployer)
    let dataConsumerAddress = await readConfig("5","DATACONSUMER_ADDRESS");
    let oracleAddress = await readConfig("5","ORACLE_ADDRESS");

    let dataConsumer = await DataConsumer__Contract.connect(deployer).attach(dataConsumerAddress);
    
    // oracleAddress = "0x99e42D431147540D09D2651eB3380e7ef49eD55e";
    // jobId = "c1763aeb2b684b3c9e5900522e42d275";

    let resultObj = await dataConsumer.addOralceAndJobId(
        oracleAddress,
        jobId,
        {
            gasPrice: 0x02540be400,
            gasLimit: 0x7a1200
        }
    );

    let isOK = await isTxSuccess(resultObj)
    console.log("call consume result : ",isOK);

    let OralceAndJobList = await dataConsumer.getOralceAndJobs();
    console.log("Oralce And JobList : ",OralceAndJobList);
    

}



main();
