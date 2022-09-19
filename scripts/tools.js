const { ethers, getChainId} = require('hardhat');
const { utils} = require('ethers')

const {
    sleep,
    readConfig
} = require('./helper')

const main = async () => {

    //
    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    const linkFactory = await ethers.getContractFactory('Link',deployer)
    let linkAddress = await readConfig("5","LINK_ADDRESS");
    let oralceAddress = await readConfig("5","ORACLE_ADDRESS");

    const linkContract = await linkFactory.connect(deployer).attach(linkAddress);
   
    let amount = utils.parseEther("1");
    let obj = await linkContract.transferAndCall(oralceAddress,amount,"0x12",{
        gasPrice: 0x02540be400,
        gasLimit: 0x7a1200
    });

    let rep = await obj.wait();
    console.log(rep);


}



main();
