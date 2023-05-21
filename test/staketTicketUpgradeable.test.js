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


  let erc721Contract,erc721UpgradeableContract,stakeTicketContract;
  let admin,user1,user2;
  before(`deploy contact `, async () => {


    let chainID = await getChainId();
    let accounts = await ethers.getSigners();
    [admin,user1,user2] = [accounts[0],accounts[1],accounts[2]];

    console.log("chainID is :" + chainID + " address :" + admin.address);

    let setupObj = await setup(admin);
    erc721Contract = setupObj.erc721Contract;
    erc721UpgradeableContract = setupObj.erc721UpgradeableContract;
    stakeTicketContract = setupObj.stakeTicketContract;
    // let nftAddress = await stakeTicketContract.getNFTContract();
    console.log("erc721Contract", erc721Contract.address,"erc721UpgradeableContract", erc721UpgradeableContract.address);

    

  })

  it('mint and burn ticket nft upgradeable', async function() {

    await stakeTicketContract.connect(user1).claim("0x0000000000000000000000000000000000000000000000000000000000000001",
    user2.address,[],[],1);

    let tickInfo = await stakeTicketContract.getTickFromTokenId(1);
    console.log(tickInfo);



  })
  
  it('burn ticket nft upgradeable', async function() {

    erc721UpgradeableContract.connect(user2).setApprovalForAll(stakeTicketContract.address,true);
    await stakeTicketContract.connect(user2).burnTickUpgradeable(1,"0x1234");

    tickInfo = await stakeTicketContract.getTickFromTokenId(1);
    console.log(tickInfo);

  })

  

})
