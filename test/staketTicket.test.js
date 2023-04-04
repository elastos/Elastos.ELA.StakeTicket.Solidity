/* External Imports */
const { ethers, network ,upgrades} = require('hardhat')
const chai = require('chai')
const { solidity } = require('ethereum-waffle')
const { expect } = chai
let util = require('ethereumjs-util')

var Web3 = require('web3')
var web3 = new Web3(network.provider)


const {
  setup
} = require("../scripts/utils/helper")

chai.use(solidity)

describe(`Stake Ticket Contact `, () => {


  let erc721Contract,stakeTicketContract;
  let admin,user1,user2;
  before(`deploy contact `, async () => {


    let chainID = await getChainId();
    let accounts = await ethers.getSigners();
    [admin,user1,user2] = [accounts[0],accounts[1],accounts[2]];

    console.log("chainID is :" + chainID + " address :" + admin.address);

    let setupObj = await setup(admin);
    erc721Contract = setupObj.erc721Contract;
    stakeTicketContract = setupObj.stakeTicketContract;

    let nftAddress = await stakeTicketContract.getNFTContract();
    console.log("nftAddress", nftAddress, "erc721Contract", erc721Contract.address);

  })

  it('burn ticket nft', async function() {

    // await stakeTicketContract.connect(user1).mintTick("0x01");

    //function approve(address to, uint256 tokenId) public virtual override {
    // await erc721Contract.connect(user1).approve(stakeTicketContract.address,1);
    // await stakeTicketContract.connect(user1).burnTick(1,"elaAddress");

  })
  

  it('change admin owner', async function() {
    
    // await upgrades.admin.transferProxyAdminOwnership(user1.address);
    let owner = await stakeTicketContract.owner();
    console.log("current owner is : " + owner + " admin :" + admin.address);

    await stakeTicketContract.transferOwnership(user1.address);
    let newOwner = await stakeTicketContract.owner();
    console.log("new owner is : " + newOwner + " admin :" + user1.address);
  
  })
  

})
