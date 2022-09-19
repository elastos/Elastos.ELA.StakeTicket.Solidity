/* External Imports */
const { ethers, network } = require('hardhat')
const chai = require('chai')
const { solidity } = require('ethereum-waffle')
const { expect } = chai
let util = require('ethereumjs-util')

var Web3 = require('web3')
var web3 = new Web3(network.provider)


chai.use(solidity)

describe(`EOP`, () => {

  // const PRIVATE_KEY = "0xc0ccf1ff4ff44375992c802965e2ff5ba31f35e0d9a0825f4acf7223ad6666f1";
  // const PUBLICK_KEY = "0x03866ba0716f8182e3f6bc9ee78bdfe480c165543f57fda1f6b78a025ead9f93dc";
  // const ADDRESS = "0x592A1b497F4f629A0b589fF4A0c4EE374efdDe2F";
  // let account1
  // let account2
  let accounts
  before(`load accounts`, async () => {
    // ;[ account1,account2] = await ethers.getSigners()
    // console.log(account1.address);

    accounts = await ethers.getSigners();
    console.log(accounts.length);
    console.log(accounts[0].address);
    console.log(accounts[0].PUBLICK_KEY);


  })

  let EOP
  beforeEach(`deploy EOP contract`, async () => {
    // const Factory__EOP = await ethers.getContractFactory('EOP')
    // EOP = await Factory__EOP.connect(account1).deploy()
    // await EOP.deployTransaction.wait()
  })

  it('verifySignature is true', async function() {

    // console.log(network);
    //let accounts = await web3.eth.getAccounts();
    //console.log(accounts);

    // var msg = 'Hello World'
    // var hash = web3.utils.sha3(msg)
    // console.log(hash);
    // // //console.log(hash);

    // // // var signatureObj = await web3.eth.accounts.sign(msg, PRIVATE_KEY)
    // // // console.log(signatureObj);

    // var signature = (await web3.eth.sign(hash, account1.address))
    // console.log(signature);

    // // //console.log(signatureObj.signature);
    // var result0 = await EOP.verifySignature(hash, signature, account1.address);
    // console.log(result0);

    // var result1 = await EOP.verifySignature(hash, signature, account2.address);
    // console.log(result1);

    //assert.equal(result, true)

    console.log("---");
  
  
  })


  // it(`set and get abiter list`, async () => {

  //   let hex1 = "0x026fba4bfd87bd5dee06a746812a3270a57fe17ca9e536841d1890fbb307785f81";
  //   let hex2 = "0x036fba4bfd87bd5dee06a746812a3270a57fe17ca9e536841d1890fbb307785f82";

  //   let buf1 = util.toBuffer(hex1);
  //   let buf2 = util.toBuffer(hex2);

  //   console.log(buf1);
  //   console.log(buf2);
    
  //   //
  //   await EOP.setAbiterList([buf1,buf2])
   
  //   let bufs = await EOP.getAbiterList()
  //   console.log(bufs[0]);
  //   console.log(bufs[1]);

  // })




})
