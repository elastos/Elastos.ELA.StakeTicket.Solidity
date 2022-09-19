
const { ethers, getChainId} = require('hardhat')
const { utils } = require('ethers')
const { isTxSuccess } = require('./helper')

const main = async () => {

    console.log("***0 deploy link ");
    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    let totalSupply = utils.parseEther("10000000");
    const LINK__Contract = await ethers.getContractFactory('ERC677',deployer)
    let link = await LINK__Contract.connect(deployer).deploy(
        deployer.address,
        totalSupply,
        "Link",
        "Link"
    );
    console.log("link address : ",link.address);
   
    console.log("\n***1 deploy link interface");
    const LINKInterface__Contract = await ethers.getContractFactory('LinkInterface',deployer)
    const LINKInterface = await LINKInterface__Contract.connect(deployer).deploy();
    console.log("link interface address : ",LINKInterface.address);

    let resultObj = await LINKInterface.setAddress(link.address);
    let isOK = await isTxSuccess(resultObj)
    console.log("setAddress result : ",isOK);

    console.log("\n***2 deploy oracle");
    const ORACLE__Contract = await ethers.getContractFactory('Operator',deployer)
    const oracle = await ORACLE__Contract.connect(deployer).deploy(
        link.address,
        deployer.address
    );
    console.log("oracle address : ", oracle.address);

    console.log("\n***3 set Fulfillment Permission ");
    resultObj = await oracle.setAuthorizedSenders([deployer.address]);
    isOK = await isTxSuccess(resultObj)
    console.log("setAuthorizedSenders result : ",isOK);

    console.log("\n***4 DataConsumer ");
    const DataConsumer__Contract = await ethers.getContractFactory('DataConsumer',deployer)    
    let dataConsumer = await DataConsumer__Contract.connect(deployer).deploy({
            gasPrice: 0x02540be400,
            gasLimit: 0x7a1200
        }
    );
    console.log("dataConsumer address : ",dataConsumer.address);

    console.log("\n***5 transfer link to dataConsumer"); 
    let amount = utils.parseEther("10");
    resultObj = await link.transfer(dataConsumer.address,amount);
    isOK = await isTxSuccess(resultObj)
    console.log("ransfer link result : ",isOK);  

    // console.log("\n***6 request Ethereum Post "); 
    // let jobId = "b5c9f5edb1204c818ae06bc715cb970e";
    // resultObj = await dataConsumer.requestEthereumPost(
    //     oracle.address,
    //     jobId,{
    //         gasPrice: 0x02540be400,
    //         gasLimit: 0x7a1200
    //     }
    // );
    // isOK = await isTxSuccess(resultObj)
    // console.log("requestEthereumPost result : ",isOK);

    
    console.log("\n***7 set data"); 

    let settingData = "0x7b226a736f6e727063223a22322e30222c226964223a312c22726573756c74223a7b22646964223a226469643a656c6173746f733a69717063514b6767784a444753466258776846787337795370794a426e665a73444a222c22737461747573223a302c227472616e73616374696f6e223a5b7b2274786964223a2236636534633163646533303534373465336264626436346337366138353561353134366531326261626333306462666631343061353233326134393864386537222c2274696d657374616d70223a22323032322d30332d32385431313a33323a31395a222c226f7065726174696f6e223a7b22686561646572223a7b2273706563696669636174696f6e223a22656c6173746f732f6469642f312e30222c226f7065726174696f6e223a22637265617465227d2c227061796c6f6164223a2265794a4159323975644756346443493657794a6f64485277637a6f764c336433647935334d793576636d6376626e4d765a476c6b4c335978496977696148523063484d364c7939756379356c6247467a6447397a4c6d39795a79396b61575176646a45694c434a6f64485277637a6f764c33637a6157517562334a6e4c334e6c59335679615852354c335978496c3073496d6c6b496a6f695a476c6b4f6d567359584e3062334d36615846775931464c5a326434536b524855305a695748646f526e687a4e336c5463486c4b516d356d576e4e4553694973496e4231596d78705930746c6553493657337369615751694f694a6b615751365a57786863335276637a70706358426a5555746e5a33684b52456454526d4a596432684765484d3365564e7765557043626d5a616330524b4933427961573168636e6b694c434a306558426c496a6f6952554e455530467a5a574e774d6a5532636a45694c434a6a62323530636d397362475679496a6f695a476c6b4f6d567359584e3062334d36615846775931464c5a326434536b524855305a695748646f526e687a4e336c5463486c4b516d356d576e4e4553694973496e4231596d78705930746c65554a68633255314f434936496a49786555706859584d7857456f35616b5254516c5a4657585249536d56715447566c617a68695958643256567042516d564e526d4e445a45684661794a3958537769595856306147567564476c6a59585270623234694f6c73695a476c6b4f6d567359584e3062334d36615846775931464c5a326434536b524855305a695748646f526e687a4e336c5463486c4b516d356d576e4e4553694e77636d6c7459584a35496c3073496d563463476c795a584d694f6949794d4449334c54417a4c544934564445784f6a4d784f6a457857694973496e42796232396d496a7037496e5235634755694f694a465130525451584e6c593341794e545a794d534973496d4e795a5746305a5751694f6949794d4449794c54417a4c544934564445784f6a4d784f6a457857694973496d4e795a574630623349694f694a6b615751365a57786863335276637a70706358426a5555746e5a33684b52456454526d4a596432684765484d3365564e7765557043626d5a616330524b4933427961573168636e6b694c434a7a6157647559585231636d5657595778315a534936496b68595757706f556b63316230525062544d775130564a5a44687957553571555531574d587036636a4259595452694d554a31656d744954545a7452335a74656e4e464d7a5134523364594e304a3154315a554f486875537a4e6b55315a3253575a7554315a42526d52685448526961303133496e3139222c2270726f6f66223a7b2274797065223a224543445341736563703235367231222c22766572696669636174696f6e4d6574686f64223a226469643a656c6173746f733a69717063514b6767784a444753466258776846787337795370794a426e665a73444a237072696d617279222c227369676e6174757265223a22797178586e723342446152355a7766614675325974576a33686b767367507165447a614c6570455537334e386d4d59415143534e37635a4e69686251476171567677545a72474547474d556b6d3258372d2d58783577227d7d7d5d7d7d0a";
    resultObj = await dataConsumer.setDataTest(settingData);
    isOK = await isTxSuccess(resultObj)
    console.log("setDataTest result : ",isOK);

    let outData = await dataConsumer.didData();
    console.log("outData is ",outData);

    let testByte1 = await dataConsumer.testByte();
    console.log("testByte1 is ",testByte1);
    


}






main();
