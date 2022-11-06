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


  it('base params', async function() {

    let name = await erc721Contract.name();
    expect(name).to.equal("ELAStake721");
  
  })

  it('mint ticket nft', async function() {

    await stakeTicketContract.mintTick(
      user1.address,1,"0x01",2,1234,"supperNode","0x1234"

    );

    let result = await stakeTicketContract.getTickFromTokenId(1);
    // console.log(result);
    expect(result.amount.toString()).to.equal("2");
    expect(result.startTimeSpan.toString()).to.equal("1234");
    expect(result.supperNode).to.equal("supperNode");
    expect(result.txHash).to.equal("0x1234");

  })

  it('burn ticket nft', async function() {

    await stakeTicketContract.mintTick(
      user1.address,2,"0x01",2,1234,"supperNode","0x1234"
    );

    //function approve(address to, uint256 tokenId) public virtual override {
    await erc721Contract.connect(user1).approve(stakeTicketContract.address,2);
    await stakeTicketContract.connect(user1).burnTick(2);

  })
  
  it('tranfer ticket nft', async function() {

    await stakeTicketContract.mintTick(
      user1.address,3,"0x01",2,1234,"supperNode","0x1234"
    );
    await erc721Contract.connect(user1).approve(stakeTicketContract.address,3);

    await stakeTicketContract.connect(user1).tranferTick(
      user2.address,3
    );

    let result = await stakeTicketContract.getTickFromTokenId(3);
    // console.log(result);
    expect(result.amount.toString()).to.equal("2");
    expect(result.startTimeSpan.toString()).to.equal("1234");
    expect(result.supperNode).to.equal("supperNode");
    expect(result.txHash).to.equal("0x1234");
    expect(result.owner).to.equal(user2.address);

  })
  
  it('withDraw ticket nft', async function() {

    await stakeTicketContract.mintTick(
      user1.address,4,"0x01",2,1234,"supperNode","0x1234"
    );

    await stakeTicketContract.connect(user1).withDrawTick(4,"abcd");
    let result = await stakeTicketContract.getTickFromTokenId(4);
    // console.log(result);
    expect(result.withDrawTo).to.equal("abcd");

  })

})
