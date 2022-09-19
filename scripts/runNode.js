const { 
    sleep ,
    setSession,
    addChainLinkAccount,
    createJob,
    getAribtrSign,
    callAddOracleAddJobId,
    setFulfillmentPermission,
    updateEvnSetting,
    deployOralce
} = require('./helper')


const main = async () => {

    console.log("run node ");
    await updateEvnSetting();
    
    //set session
    await setSession();
    await sleep(2000);

    await addChainLinkAccount();
    await sleep(2000);

    await deployOralce();
    await sleep(2000);

    await setFulfillmentPermission();

    await createJob();
    await sleep(2000);
    
    // await updateJobId();
    await getAribtrSign();
    await callAddOracleAddJobId();

}
 

main();
