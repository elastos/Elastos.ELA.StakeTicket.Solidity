
const { ethers, getChainId} = require('hardhat')

const {
    writeConfig
} = require('./helper')

const main = async () => {

    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    const arbiter = await ethers.getContractFactory('Arbiter',deployer)
    const arbiterContract = await arbiter.deploy(
        {
            gasPrice: 0x02540be400,
            gasLimit: 0x7a1200
        }
    );

    console.log("arbiter Contract ",arbiterContract.address);
    await writeConfig("2","2","ARBITER_ADDRESS",arbiterContract.address);
    
    
    // const tx = await arbiterContract.deployTransaction().wait();
    // console.log(tx);

}



main();
