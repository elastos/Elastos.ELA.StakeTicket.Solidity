
const { ethers, getChainId} = require('hardhat')
const { readConfig } = require('./helper')

const main = async () => {

    console.log("8 call Consumer Result ...");

    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID );
    //console.log("chainID is :" + chainID + " address :" + deployer.address);

    const DataConsumer__Contract = await ethers.getContractFactory('DataConsumer',deployer)
    let dataConsumerAddress = await readConfig("5","DATACONSUMER_ADDRESS");

    dataConsumer = await DataConsumer__Contract.connect(deployer).attach(dataConsumerAddress);
   
    // let step = await dataConsumer.step();
    // console.log("reuslt : ",step.toString());
    let searchData = await dataConsumer.getSearchResult();
    // console.log(searchData);

    console.log("is search conformed         : ",searchData[0]);
    console.log("search data hash            : ",searchData[1]);
    console.log("total search number         : ",searchData[2].toString());
    console.log("hit search number           : ",searchData[3].toString());

    let blockNumStr = "";
    let searchBlockList = searchData[4];
    for(var i = 0 ;i < searchBlockList.length;i ++){
        if(i == 0){
            blockNumStr = searchBlockList[i].toString();
        }else{
            blockNumStr = blockNumStr  + "," + searchBlockList[i].toString();
        }
    }
    console.log("block search block numbers  : ",blockNumStr);

}



main();
