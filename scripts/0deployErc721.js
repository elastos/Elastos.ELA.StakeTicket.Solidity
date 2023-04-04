
const { ethers, getChainId} = require('hardhat')
const { utils} = require('ethers')
const {NAME721,SYMBOL721,BASEURI, writeConfig,deployERC721 } = require('./utils/helper')

const main = async () => {


    let chainID = await getChainId();
    //let chainID = 0;
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);


    let erc721Contract = await deployERC721(NAME721,SYMBOL721,BASEURI,deployer);
    await writeConfig("0","0","ERC721_ADDRESS",erc721Contract.address);
    console.log("erc721 address : ",erc721Contract.address);
    console.log("nftName", await erc721Contract.name(), "\nsymbol", await erc721Contract.symbol(), "\nbaseURL", await erc721Contract.baseURI());
   
}



main();
