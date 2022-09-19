const { 

    deployLink,
    deployLinkInterface,
    deployOralce,
    deployDataConsumer,

    settingLinkInterfaceFromConfig
} = require('./helper')


const main = async () => {
    
    console.log("run presetting ");

    //1.0 deploy link
    await deployLink();

    //2.0 deploy linkinterface
    await deployLinkInterface();

    //3.0 oracle 
    // await deployOralce();

    //4.0 set link interface
    await settingLinkInterfaceFromConfig();

    //5.0 dataconsume
    await deployDataConsumer();
}
 

main();
