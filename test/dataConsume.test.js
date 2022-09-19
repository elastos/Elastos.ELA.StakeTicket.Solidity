/* External Imports */
const { ethers, network } = require('hardhat')
const chai = require('chai')
const { solidity } = require('ethereum-waffle')
const { expect } = chai
let util = require('ethereumjs-util')

var Web3 = require('web3')
var web3 = new Web3(network.provider)

const {
  writeConfig,
  readConfig
} = require('../scripts/helper')

chai.use(solidity)

describe(`data consume`, () => {


  let dataConsumer
  before(`deploy contact `, async () => {


    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    const DataConsumer__Contract = await ethers.getContractFactory('DataConsumer',deployer)
    dataConsumer = await DataConsumer__Contract.connect(deployer).deploy(
        {
            gasPrice: 0x02540be400,
            gasLimit: 0x7a1200
        }
    );

  })


  it('call consume', async function() {


    console.log("---");

    let jobIdList = await readConfig("0","JOB_ID_LIST");
    let oralceAddressList = await readConfig("0","ORACLE_ADDRESS_LIST");


    let length = jobIdList.length;
    console.log(length);

    for(var i = 0 ;i < length ;i ++){
      console.log(oralceAddressList[i]);
      console.log(jobIdList[i]);

      await dataConsumer.setOralceAndJobId(oralceAddressList[i],jobIdList[i]);
    }

    await dataConsumer.requestEthereumPriceFromList();
  
  
  
  })





})
