
const { ethers, getChainId} = require('hardhat')
const { utils} = require('ethers')
const { writeConfig,deployStakeTicket,readConfig, attachNFTContract, deployERC721Upgradeable} = require('./utils/helper')

const main = async () => {


    let chainID = await getChainId();
    //let chainID = 0;
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    erc721Address = await readConfig("1","ERC721_BPOSV1_ADDRESS");
    let stakeSticketAddress = await readConfig("1", "STAKE_TICKET_ADDRESS")
    let stakeSticket = await attachStakeTicket(deployer, stakeSticketAddress)
    console.log("stakeSticket.address=", stakeSticket.address);
    tx = await stakeSticket.setERC721UpgradeAddress(erc721Address);
    console.log("setERC721UpgradeAddress", tx.hash);
   
}



main();
