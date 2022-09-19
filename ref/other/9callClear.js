
const { ethers, getChainId} = require('hardhat')
const { readConfig,isTxSuccess } = require('./helper')

const main = async () => {

    console.log("8 call Consumer Result ...");

    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID );
    //console.log("chainID is :" + chainID + " address :" + deployer.address);

    const DataConsumer__Contract = await ethers.getContractFactory('DataConsumer',deployer)
    let dataConsumerAddress = await readConfig("5","DATACONSUMER_ADDRESS");

    dataConsumer = await DataConsumer__Contract.connect(deployer).attach(dataConsumerAddress);
   

    let resultObj = await dataConsumer.clearSearchCondition(
        {
            gasPrice: 0x02540be400,
            gasLimit: 0x7a1200
        }
    );

    let isOK = await isTxSuccess(resultObj)
    console.log("call consume result : ",isOK);

}



main();
