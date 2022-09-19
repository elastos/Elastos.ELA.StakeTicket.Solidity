
const { ethers, getChainId} = require('hardhat')
const { readConfig} = require('./helper')

const main = async () => {

    console.log("6 get arbiter list ....");

    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    const DataConsumer__Contract = await ethers.getContractFactory('DataConsumer',deployer)
    let dataConsumerAddress = await readConfig("5","DATACONSUMER_ADDRESS");
  
    let dataConsumer = await DataConsumer__Contract.connect(deployer).attach(dataConsumerAddress);  
    

    // function p256Verify(string memory _pubkey, string memory  _data, string memory _sig) public view returns(bool){
    let verify = await dataConsumer.p256Verify(
        "03585451831671d32c12da70f009adb6e423dfbfdd012368d9038c8b896918a62a",
        "c92bff31c5b9aa77263a552d1363e2b8766bb9e3e1e666dbe80e0a52ac61b54ca97cc08827777655175d9b2ae4173acf1b4de791d8c1588ffb7b124ea3a41c19",
        "e121cec02c815385f40f552ba375664bce8fccdc36a6b43d1f23832e980f68d6c7c6194de03c380aebba2cab55c96b6c19a65975f0aee3bc4e6074bed23333d7"
        );
    console.log("xxl abiterList : ",verify);

}



main();
