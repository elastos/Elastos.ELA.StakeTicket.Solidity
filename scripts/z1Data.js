const { ethers, getChainId,upgrades} = require('hardhat')
const { utils } = require('ethers')
const { isTxSuccess } = require('./helper')

const main = async () => {

    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    
    const DataConsumer__Contract = await ethers.getContractFactory('DataConsumer',deployer)    
    const dataConsumer = await upgrades.deployProxy(
        DataConsumer__Contract, 
        ["v1.0.0"], 
        { initializer: '__DataConsumer_init' },
        {
            gasPrice: 0x02540be400,
            gasLimit: 0x7a1200
        }
    );
    console.log("dataConsumer address : " + dataConsumer.address);  
    
    let _oracle =  ("0x41eA6aD88bbf4E22686386783e7817bB7E82c1ed").toLowerCase();
    let _jobId = "1390afd8a08e4e61aae9961d338c8011";
    let _pubKey = "03bfd8bd2b10e887ec785360f9b329c2ae567975c784daca2f223cb19840b51914"
    let _sign = "fe56944aa3deebeeb64e9a822a0c9320c55ac67392926037dea404860cf63ec4d4065bf5f32de45afe0568bd3146107569d1590c6c7c61f878e3f4ae3e3869c0"


    console.log("js param :",[_oracle,_jobId,_pubKey,_sign]);

    // function addOralceAndJobId(
    //     address _oracle,
    //     string memory _jobId,
    //     string memory _pubKey,
    //     string memory _address,   
    //     string memory _sign
    //   ) external {
    await dataConsumer.addOralceAndJobId(
        _oracle,_jobId,_pubKey,_sign
    );
    





}






main();
