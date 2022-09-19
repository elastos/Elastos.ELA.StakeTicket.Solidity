
const { ethers, getChainId} = require('hardhat')
const { utils} = require('ethers')
const { writeConfig } = require('./helper')

const main = async () => {


    console.log("0 deploy link ....");

    let chainID = await getChainId();
    //let chainID = 0;
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    let totalSupply = utils.parseEther("10000000");
    const LINK__Contract = await ethers.getContractFactory('ERC677',deployer)

    LINK = await LINK__Contract.connect(deployer).deploy(
        deployer.address,
        totalSupply,
        "ELink",
        "ELink",
        {
            gasPrice: 0x02540be400,
            gasLimit: 0x7a1200
        }
    );
    await writeConfig("1","1","LINK_ADDRESS",LINK.address);
    console.log("link address : ",LINK.address);
   
}



main();
