
const { ethers, getChainId} = require('hardhat')
const { utils} = require('ethers')
const {attachUpgradeNFTContract, readConfig,attachStakeTicket } = require('./utils/helper')

const main = async () => {


    let chainID = await getChainId();
    //let chainID = 0;
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is: " + chainID + " address: " + deployer.address);

    let stakeSticketAddress = await readConfig("1", "STAKE_TICKET_ADDRESS")
    let stakeSticket = await attachStakeTicket(deployer, stakeSticketAddress)

    let erc721Address = await readConfig("0","ERC721_BPOSV1_ADDRESS");
    let nft2Contract = await attachUpgradeNFTContract(deployer, erc721Address)

    let tx = await nft2Contract.setMinterRole(stakeSticket.address);
    console.log("setMinerRole2 tx.hash", tx.hash)
}



main();
