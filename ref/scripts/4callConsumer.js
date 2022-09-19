
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
    let dataConsumerAddress = await readConfig("2","DATACONSUMER_ADDRESS");

    dataConsumer = await DataConsumer__Contract.connect(deployer).attach(dataConsumerAddress);
    
    let txObj = await dataConsumer.requestEthereumPriceFromList(
        {
            gasPrice: 0x02540be400,
            gasLimit: 0x7a1200
        }
    );

    let rep = await txObj.wait();
    console.log(rep);

}



main();
