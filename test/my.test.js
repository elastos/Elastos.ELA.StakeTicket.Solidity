/* External Imports */
const { ethers, network } = require('hardhat')
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

  })

  //
  // it('mint ticket test', async function() {
  //
  //   console.log(user1.address,12,"0x0000000000000000000000000000000000000000000000000000000000000001");
  //
  //   await stakeTicketContract.mintTickTest(
  //     user1.address,12,"0x0000000000000000000000000000000000000000000000000000000000000001"
  //
  //   );
  //
  // })

})
