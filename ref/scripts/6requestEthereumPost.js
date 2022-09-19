
const { ethers, getChainId} = require('hardhat')
const { readConfig,isTxSuccess} = require('./helper')

const main = async () => {

    //TODO need to get
    //let jobId = "8a1ad29a700f41e9ac560e5e4a64a516";
    let jobId = "1390afd8a08e4e61aae9961d338c8056";

    console.log("6 request Ethereum Post ....");

    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    const DataConsumer__Contract = await ethers.getContractFactory('DataConsumer',deployer)
    let dataConsumerAddress = await readConfig("5","DATACONSUMER_ADDRESS");
    let oracleAddress = await readConfig("5","ORACLE_ADDRESS");

    let dataConsumer = await DataConsumer__Contract.connect(deployer).attach(dataConsumerAddress);
    
    let resultObj = await dataConsumer.requestEthereumPost(
        oracleAddress,
        jobId,
        {
            gasPrice: 0x02540be400,
            gasLimit: 0x7a1200
        }
    );

    let isOK = await isTxSuccess(resultObj)
    console.log("call consume result : ",isOK);

    

}



main();
