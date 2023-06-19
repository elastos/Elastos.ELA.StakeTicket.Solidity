
const { ethers, getChainId} = require('hardhat')
const { utils} = require('ethers')
const { writeConfig,deployStakeTicket,readConfig, attachNFTContract, deployERC721Upgradeable} = require('./utils/helper')

const main = async () => {


    let chainID = await getChainId();
    //let chainID = 0;
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    let erc721Address = await readConfig("0","ERC721_ADDRESS");

    let stakeTicketContract = await deployStakeTicket(erc721Address,deployer);
    await writeConfig("0","1","STAKE_TICKET_ADDRESS",stakeTicketContract.address);
    console.log("stake ticket address : ",stakeTicketContract.address);

    let nftContract = await attachNFTContract(deployer, erc721Address)

    let tx = await nftContract.setMinterRole(stakeTicketContract.address);
    console.log("setMinerRole1 tx.hash", tx.hash)


    erc721Address = await readConfig("0","ERC721_BPOSV1_ADDRESS");
    nftContract = await attachNFTContract(deployer, erc721Address)

    tx = await nftContract.setMinterRole(stakeTicketContract.address);
    console.log("setMinerRole2 tx.hash", tx.hash)

    tx = await nftContract.setERC721UpgradeAddress(erc721Address)
    console.log("setERC721UpgradeAddress", tx.hash);
   
}



main();
