
const { ethers, getChainId} = require('hardhat')
const { utils} = require('ethers')
const { writeConfig,deployStakeTicket,readConfig } = require('./utils/helper')

const main = async () => {


    let chainID = await getChainId();
    //let chainID = 0;
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    let erc721Address = await readConfig("0","ERC721_ADDRESS");

    let stakeTicketContract = await deployStakeTicket(erc721Address,"v0.0.1",deployer);
    await writeConfig("0","1","STAKE_TICKET_ADDRESS",stakeTicketContract.address);
    console.log("stake ticket address : ",stakeTicketContract.address);
   
}



main();
