
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

    console.log(1);
    let txObj = await dataConsumer.requestEthereumPrice("0x4625719941122b062516a6f7F72aB9Ddda078aC2","024d090d69f44936a6f3e3d325301bec");
    console.log(2);

    let rep = await txObj.wait();
    console.log(rep);

}



main();
