const { ethers: hEether } = require('hardhat');
const fs = require('fs')
const path = require('path')
const axios = require('axios').default;
require('dotenv').config();
const { execSync } = require('child_process')    
const log4js = require('log4js');
log4js.configure({
    appenders:  { out: { type: "file", filename: "logs/out.log" } },
    categories: { default: { appenders: ["out"], level: "info" } }
});

const logger = log4js.getLogger(); 
let cmd = "",showInfo="",result="",no = 0;

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
    return path.resolve(__dirname, '.') + "/config"
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
  

async function clearPostgres(){
    
    //clear data
    cmd = `rm -rf ${process.env.db_path}/*`
    showInfo = "clear data [postgres database]";
    try{ await runCmd()}catch(err){}

    //clear postgres
    cmd = "docker rm -f postgres /dev/null 2>&1 ";
    showInfo = "clear container [postgres database]";
    try{ await runCmd()}catch(err){}

}

async function clearChainLink(){

    //clear chainlink
    cmd = "docker rm -f chainlink /dev/null 2>&1 ";
    showInfo = "clear container [chainlink node]";
    try{ await runCmd()}catch(err){}
}

async function startPostgres(){

    //start postgres
    let dbPassword = process.env.db_password;
    let dbPath = process.env.db_path

    cmd =`mkdir -p ${dbPath}`;
    try{ await runCmd(false)}catch(err){}
    
    showInfo="start container [postgres database]";
    cmd = ` 
        docker run -d \
        --name postgres \
        -p 5432:5432 \
        -e POSTGRES_PASSWORD=${dbPassword} \
        -e PGDATA=/var/lib/postgresql/data/pgdata \
        -v ${dbPath}:/var/lib/postgresql/data \
        postgres  \
    `
    try{ await runCmd()}catch(err){console.log("xxl error",err);}

}

async function startChainlink(){

    //start chainlink
    await writeEvnFile();
    await addLinkAccountAndPassword();

    await sleep(2000);

    showInfo="start container [chainlink node]";
    cmd = ` 
    cd ${process.env.link_path} && 
    docker run -d -p 6688:6688 -v ${process.env.link_path}:/chainlink -it \
    --env-file=.env --name chainlink \
    smartcontract/chainlink:1.3.0 local n \
    -p /chainlink/password.txt \
    -a /chainlink/apicredentials.txt
    `
    try{ await runCmd()}catch(err){console.log("xxl error",err);}
}

async function addChainLinkAccount(){

    cmd = "curl -b ./cookie -c ./cookie localhost:6688/v2/keys/eth";
    try{
        showInfo = "get [chainlink account]" 
        result = await runCmd()

        console.log("xxl result :",result);
        let resultObj = JSON.parse(result);
        
        if(resultObj.data.length > 0){
            await writeConfig("1","1","ACCOUNT_ADDRESS",resultObj.data[0].id);
        }else{
            console.log("get [chainlink account] error ");
            exit -1;
        }
    }catch(err){
        console.log("xxl error",err);
    }
}

async function deployLink(){

    //
    cmd = `yarn scripts scripts/0deployLink.js --network ${process.env.enviroment}`;
    showInfo="deploy [link contract]";
    try{ await runCmd()}catch(err){console.log("xxl error",err);}

}

async function deployLinkInterface(){

    cmd = `yarn scripts scripts/1deployLinkinterface.js --network ${process.env.enviroment}`;
    showInfo="deploy [linkinterface contract]";
    try{ await runCmd()}catch(err){console.log("xxl error",err);}

}

async function deployOralce(){

    //
    cmd = `yarn scripts scripts/3deployOracle.js --network ${process.env.enviroment}`;
    showInfo="deploy [oracle contract]";
    try{ await runCmd()}catch(err){console.log("xxl error",err);}

}

async function setFulfillmentPermission(){
    //
    cmd = `yarn scripts scripts/4setFulfillmentPermission.js --network ${process.env.enviroment}`
    showInfo="set [fulfillment permission]";
    try{ await runCmd()}catch(err){console.log("xxl error",err);}
}


async function callAddOracleAddJobId(){

    cmd = `yarn scripts scripts/7addOralceAndJobId.js --network ${process.env.enviroment}`;
    showInfo="call [add oralce and jobid]";
    try{ await runCmd()}catch(err){console.log("xxl error",err);}

}

async function deployDataConsumer(){
    cmd = `yarn scripts scripts/5dataConsumer.js --network ${process.env.enviroment}`;
    showInfo="deploy [dataConsumer contract]";
    try{ await runCmd()}catch(err){console.log("xxl error",err);}
}

async function getAribtrSign(){

    let oracleAddress =  await readConfig("1","ORACLE_ADDRESS");
    let jobId = await readConfig("1","JOB_ID");
    let oracleAndJobId = oracleAddress.toLowerCase().substr(2) + jobId
    // console.log("xxl :",oracleAndJobId);
    
    cmd = `${process.env.account_tool_Path} ${process.env.keystore_path} ${process.env.keystore_password} ${oracleAndJobId}`;
    showInfo="get [arbiter signature]";
    try{ 
        let resultObj = await runCmd();
        
        var resultArray = resultObj.split("\n");
        if(resultArray.length > 2){
            publicKey = resultArray[0].split(":")[1].trim();
            signtrue = resultArray[1].split(":")[1].trim();
            await writeConfig("1","1","PUBLIC_KEY",publicKey);
            await writeConfig("1","1","SIGNTRUE",signtrue);
        }else{
            console.log("parse [account tool] error");
            exit -1;
        }
        //console.log("xxl resultObj ",signtrue);
        return signtrue;
    }catch(err){
        console.log("xxl error",err);
    }
}


async function runCmd(isShowInfo=true) {

    try{
        result = await execSync(cmd, {encoding: 'utf8'});   
        logger.info(result);    
        if(isShowInfo){
            no ++;
            let strShowInfo = `step ${no} : ${showInfo} `
            console.log(strShowInfo);
            //logger.info(strShowInfo);
        }
        return result;
    }catch(err){
        console.log("xxl runCmd ",err);
        throw new Error(err);
    }

}

const { exit } = require('process');
async function writeEvnFile(){

    let linkPath = process.env.link_path
    cmd =`mkdir -p ${linkPath}`;
    try{ await runCmd(false)}catch(err){}

//xxl TODO
    let evnContent =`ROOT=/chainlink
LOG_LEVEL=warn
ETH_CHAIN_ID=${process.env.chain_id}
MIN_OUTGOING_CONFIRMATIONS=1
LINK_CONTRACT_ADDRESS=${process.env.link_address}
CHAINLINK_TLS_PORT=0
SECURE_COOKIES=false
GAS_UPDATER_ENABLED=false
ALLOW_ORIGINS=*
ETH_URL=ws://${process.env.internal_url}:${process.env.esc_ws_port}
DATABASE_URL=postgresql://postgres:elastos@${process.env.internal_url}:5432/postgres?sslmode=disable
DATABASE_TIMEOUT=0
DEFAULT_HTTP_TIMEOUT=100s
MINIMUM_CONTRACT_PAYMENT_LINK_JUELS=0
ETH_GAS_LIMIT_DEFAULT=1150000
DEFAULT_HTTP_LIMIT=3276800
`

    let linkPathEnv = process.env.link_path + "/.env";
    fs.writeFileSync(linkPathEnv,evnContent, { encoding: 'utf8' }, err => {})

}

async function addLinkAccountAndPassword(){

    let evnContent =`${process.env.link_account}
${process.env.link_password}
`
    let linkPathEnv = process.env.link_path + "/apicredentials.txt";
    fs.writeFileSync(linkPathEnv,evnContent, { encoding: 'utf8' }, err => {})

    let passwordContent =`${process.env.db_password}`
    let linkPathPassword = process.env.link_path + "/password.txt";
    fs.writeFileSync(linkPathPassword,passwordContent, { encoding: 'utf8' }, err => {})

}


async function setSession(){

    cmd = `curl -c ./cookie -H 'Content-Type: application/json' -d \
        '{"email":"${process.env.link_account}", "PASSWORD":"${process.env.link_password}"}' \
        localhost:6688/sessions 2>/dev/null `

    try{ 
        let resultObj = await runCmd(false)
        // console.log("xxl resultObj : ",resultObj);
    }catch(err){
        // await setSession();
        console.log("xxl error ",err);
        exit -1;
    }

}

async function createJob(){

    //xxl Done ==> https://api-testnet.trinity-tech.io/eid
    let oracleAddress = await readConfig("1","ORACLE_ADDRESS");
    //console.log("xxl oracleAddress",oracleAddress);
    let jobSpec = `
    type = "directrequest"
    schemaVersion = 1
    name = "POST > Elink1 ${process.env.enviroment}"
    maxTaskDuration = "0s"
    contractAddress = "${oracleAddress}"
    minIncomingConfirmations = 0
    observationSource = """
        decode_log   [type="ethabidecodelog"
                      abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                      data="$(jobRun.logData)"
                      topics="$(jobRun.logTopics)"]
    
        decode_cbor  [type="cborparse" data="$(decode_log.data)"]
        
        fetch        [type="http" method=POST url="http://${process.env.internal_url}:20646"
                     requestData="{\\\\"jsonrpc\\\\":\\\\"2.0\\\\",\\\\"method\\\\":$(decode_cbor.method),\\\\"params\\\\":[{\\\\"did\\\\":$(decode_cbor.did)}],\\\\"id\\\\":$(decode_cbor.id)}"
                     ]
    
        encode_large [type="ethabiencode"
                    abi="(bytes32 requestId, bytes _data)"
                    data="{\\\\"requestId\\\\": $(decode_log.requestId), \\\\"_data\\\\": $(fetch)}"
                    ]
    
        encode_tx  [type="ethabiencode"
                    abi="fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)"
                    data="{\\\\"requestId\\\\": $(decode_log.requestId), \\\\"payment\\\\":   $(decode_log.payment), \\\\"callbackAddress\\\\": $(decode_log.callbackAddr), \\\\"callbackFunctionId\\\\": $(decode_log.callbackFunctionId), \\\\"expiration\\\\": $(decode_log.cancelExpiration), \\\\"data\\\\": $(encode_large)}"
                    ]
    
        submit_tx    [type="ethtx" to="${oracleAddress}" data="$(encode_tx)"]
    
        decode_log -> decode_cbor -> fetch ->  encode_large -> encode_tx -> submit_tx
    """
    `
    let jsonJobSpec = {
        "TOML":jobSpec
    }

    var strJobSpec = JSON.stringify(jsonJobSpec);
    try{
        cmd = `curl  --request POST -b ./cookie -c ./cookie  -H 'Content-Type: application/json' -d '${strJobSpec}' localhost:6688/v2/jobs`;
        showInfo="submit [chainlink job]";
        result = await runCmd()
        let resultObj = JSON.parse(result);
        console.log("xxl :",resultObj);
        
        let jobId = resultObj.data.attributes.externalJobID.replaceAll("-","");
        await writeConfig("1","1","JOB_ID",jobId);
        
    }catch(err){
        console.log("xxl error",err);
    }


}

async function setHardhatConfig(){

    let hardhatConfigPath = "../hardhat.config.js";

    fs.readFile(hardhatConfigPath, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        let result = data.
                    replace(/#internalUrl/g, process.env.internal_url).
                    replace(/#privateKey#/g, process.env.private_key)
           
        fs.writeFile(hardhatConfigPath, result, 'utf8', function (err) {
           if (err) return console.log(err);
        });
      });

}


async function updateJobId(){

    let jobId = await readConfig("1","JOB_ID");
    let dataConsumerAddress = await readConfig("1","DATACONSUMER_ADDRESS");
    await writeConfig("3","5","JOB_ID",jobId);
    await writeConfig("5","5","DATACONSUMER_ADDRESS",dataConsumerAddress);

}
async function settingLinkInterfaceFromConfig(){

    let linkinterface = await readConfig("1","LINK_INTERFACE_ADDRESS");
    await settingLinkInterfaceFromParam(linkinterface);

}

async function settingLinkInterfaceFromParam(linkinterface){
    
    let fullPath = "./contracts/chainlink/ChainlinkClient.sol";
    let contentText = fs.readFileSync(fullPath,'utf-8');
    contentText = contentText.replace(/0x[a-fA-F0-9]{40}/i,linkinterface);
    fs.writeFileSync(fullPath, contentText, { encoding: 'utf8' }, err => {})


}


async function updateEvnSetting(){

    await writeConfig("1","1","LINK_ADDRESS",process.env.link_address);
    await writeConfig("1","1","LINK_INTERFACE_ADDRESS",process.env.link_interface_address);
    //await writeConfig("1","1","ORACLE_ADDRESS",process.env.oracle_address);
    await writeConfig("1","1","DATACONSUMER_ADDRESS",process.env.dataconsumer_address);

    await settingLinkInterfaceFromParam(process.env.link_interface_address)

}

module.exports = {
    writeConfig,
    readConfig, 
    sleep,

    isTxSuccess,
    hex2a,

    clearPostgres,
    clearChainLink,
    startPostgres,
    startChainlink,
    addChainLinkAccount,
    deployOralce,
    setFulfillmentPermission,
    callAddOracleAddJobId,
    deployDataConsumer,
    getAribtrSign,
    runCmd,
    writeEvnFile,
    addLinkAccountAndPassword,
    setSession,
    createJob,
    setHardhatConfig,
    updateJobId,

    deployLink,
    deployLinkInterface,
    settingLinkInterfaceFromConfig,
    settingLinkInterfaceFromParam,
    updateEvnSetting

}