const fs = require('fs')
const path = require('path')
const axios = require('axios').default;
require('dotenv').config();
const log4js = require('log4js');
const { ethers,upgrades } = require("hardhat");

log4js.configure({
    appenders:  { out: { type: "file", filename: "logs/out.log" } },
    categories: { default: { appenders: ["out"], level: "info" } }
});

function getPath(fromFile){
    let dir =  path.resolve(__dirname, '../config');
    if (fs.existsSync(dir) == false) {
        fs.mkdirSync(dir)
    }
    return  path.resolve(__dirname, '../config/' + fromFile + '.json');
}

const writeConfig = async (fromFile,toFile,key, value) => {

    let fromFullFile = getPath(fromFile);
    if (fs.existsSync(fromFullFile) == false) {
        fs.writeFileSync(fromFullFile, "{}", { encoding: 'utf8' }, err => {})
    }

    let contentText = fs.readFileSync(fromFullFile,'utf-8');
    if (contentText == "") {
        contentText = "{}";
    }
    let data = JSON.parse(contentText);
    data[key] = value;

    let toFullFile = getPath(toFile);
    fs.writeFileSync(toFullFile, JSON.stringify(data, null, 4), { encoding: 'utf8' }, err => {})
}

const readConfig = async (fromFile,key) => {

    let fromFullFile = path.resolve(getConfigPath(), './' + fromFile + '.json')
    let contentText = fs.readFileSync(fromFullFile,'utf-8');
    let data = JSON.parse(contentText);
    return data[key];

}

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));
}

const getConfigPath = () => {
    //return "scripts/config"
    return path.resolve(__dirname, '.') + "/.././config"
}

const isTxSuccess = async (resultObj) =>{

    let repObj = await resultObj.wait();  
    //console.log(repObj);
    return repObj.status == 1 ? true:false

}

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

//
let gasPrice = 0x02540be400;
let gasLimit = 0x7a1200;

async function deployERC721(name,symbol,baseURI,account){


    // constructor(string memory name, string memory symbol, string memory baseURI) ERC721(name, symbol) {
    const erc721Factory = await ethers.getContractFactory("ERC721MinterBurnerPauser",account);

    const erc721Contract = await erc721Factory.deploy(
        name,symbol,baseURI
    )
    return erc721Contract;

}

async function deployERC721Upgradeable(name,symbol,baseURI,account){


    // constructor(string memory name, string memory symbol, string memory baseURI) ERC721(name, symbol) {
    const erc721UpgradeableFactory = await ethers.getContractFactory("ERC721UpradeableMinterBurnerPauser",account);

    const erc721ContractUpgradeable = await upgrades.deployProxy(
        erc721UpgradeableFactory,
        [
            name,symbol,baseURI
        ],
        {
            initializer:  "__ERC721UpradeableMinterBurnerPauser_initialize",
            unsafeAllowLinkedLibraries: true,
        }
    );

    return erc721ContractUpgradeable;

}


async function upgradeERC721Upgradeable(upgradeAddress,account){


    // constructor(string memory name, string memory symbol, string memory baseURI) ERC721(name, symbol) {
    const erc721UpgradeableFactory = await ethers.getContractFactory("ERC721UpradeableMinterBurnerPauser",account);

    await upgrades.upgradeProxy(
        upgradeAddress, 
        erc721UpgradeableFactory,{from:account.address},
        { gasPrice: gasPrice, gasLimit: gasLimit}
    );

}

async function deployStakeTicket(erc721Address,account){
    // constructor(string memory name, string memory symbol, string memory baseURI) ERC721(name, symbol) {
    const stakeTicketFactory = await ethers.getContractFactory("StakeTicket",account);
    const stakeTicketContract = await upgrades.deployProxy(
        stakeTicketFactory,
        [
            erc721Address
        ],
        {
            initializer:  "__StakeTicket_init",
            unsafeAllowLinkedLibraries: true,
        }
    );

    return stakeTicketContract;

}

let NAME721 = "BPoS NFT";
let SYMBOL721 = "bNFT";
let BASEURI = "";

async function setup(admin){

    let erc721Contract = await deployERC721(
                            NAME721,
                            SYMBOL721,
                            BASEURI,
                            admin);
 
    let erc721UpgradeableContract = await deployERC721Upgradeable(
        NAME721,
        SYMBOL721,
        BASEURI,
        admin);

    let stakeTicketContract = await deployStakeTicket(
                                    erc721Contract.address,
                                    erc721UpgradeableContract.address,
                                    admin);

    await erc721Contract.setMinterRole(stakeTicketContract.address);    
    await erc721UpgradeableContract.setMinterRole(stakeTicketContract.address);
    
    return {
        erc721Contract,erc721UpgradeableContract,stakeTicketContract
    }
}

async function attachNFTContract(account, address){
    const facotryNFT = await ethers.getContractFactory('ERC721MinterBurnerPauser',account)
    let nftContract  = await facotryNFT.connect(account).attach(address);
    return nftContract;
}

async function attachUpgradeNFTContract(account, address){
    const facotryNFT = await ethers.getContractFactory('ERC721UpradeableMinterBurnerPauser',account)
    let nftContract  = await facotryNFT.connect(account).attach(address);
    return nftContract;
}


async function attachStakeTicket(account, address){
    const facotryStakeTicket = await ethers.getContractFactory('StakeTicket',account)
    let stakeTicket  = await facotryStakeTicket.connect(account).attach(address);
    return stakeTicket;
}

module.exports = {
    writeConfig,
    readConfig, 
    deployERC721,
    deployERC721Upgradeable,
    deployStakeTicket,
    sleep,
    attachStakeTicket,
    attachNFTContract,
    attachUpgradeNFTContract,
    isTxSuccess,
    NAME721,
    setup,
    SYMBOL721,
    BASEURI,
    upgradeERC721Upgradeable


}