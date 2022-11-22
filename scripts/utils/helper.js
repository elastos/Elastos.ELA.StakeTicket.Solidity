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


const writeConfig = async (fromFile,toFile,key, value) => {

    let fromFullFile = path.resolve(getConfigPath(), './' + fromFile + '.json')
    let contentText = fs.readFileSync(fromFullFile,'utf-8');
    let data = JSON.parse(contentText);
    data[key] = value;

    let toFullFile = path.resolve(getConfigPath(), './' + toFile + '.json')
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
        name,symbol,baseURI,
        { gasPrice: gasPrice, gasLimit: gasLimit}
    )
    return erc721Contract;

}

async function deployStakeTicket(erc721Address,version,account){


    // constructor(string memory name, string memory symbol, string memory baseURI) ERC721(name, symbol) {
    const stakeTicketFactory = await ethers.getContractFactory("StakeTicket",account);
    const stakeTicketContract = await upgrades.deployProxy(
        stakeTicketFactory,
        [
            erc721Address,version
        ],
        {
            initializer:  "__StakeTicket_init",
            unsafeAllowLinkedLibraries: true,
        },
        { gasPrice: gasPrice, gasLimit: gasLimit}
    );

    return stakeTicketContract;

}

let NAME721 = "ELAStake721";
let SYMBOL721 = "ELAStake721";
let BASEURI = "https://elaTicket";

async function setup(admin){

    let erc721Contract = await deployERC721(
                            NAME721,
                            SYMBOL721,
                            BASEURI,
                            admin);
 
    let stakeTicketContract = await deployStakeTicket(
                                    erc721Contract.address,
                                    "v1.0.0",
                                    admin);

    await erc721Contract.setMinterRole(stakeTicketContract.address);
    
    return {
        erc721Contract,stakeTicketContract
    }
}

module.exports = {
    writeConfig,
    readConfig, 
    deployERC721,
    deployStakeTicket,
    sleep,

    isTxSuccess,
    hex2a,
    setup


}