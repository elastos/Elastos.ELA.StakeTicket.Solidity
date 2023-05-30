
const { ethers, getChainId} = require('hardhat')
const { utils} = require('ethers')
const {upgradeERC721Upgradeable,readConfig } = require('./utils/helper')

const main = async () => {


    let chainID = await getChainId();
    //let chainID = 0;
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    let erc721UpgradeAddress = await readConfig("0","ERC721_BPOSV1_ADDRESS");
    console.log("erc721 upgrade address : ",erc721UpgradeAddress);

   await upgradeERC721Upgradeable(erc721UpgradeAddress,deployer)

   console.log("erc721 upgrade address : ",erc721UpgradeAddress);
   
}



main();
