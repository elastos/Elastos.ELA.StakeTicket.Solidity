const { 
    sleep ,
    setSession,
    addChainLinkAccount,
    deployOralce,
    createJob,
    deployDataConsumer,
    getAribtrSign,
    callAddOracleAddJobId,
    setFulfillmentPermission,
} = require('./helper')


const main = async () => {

    //set session
    await setSession();
    await sleep(2000);

    await addChainLinkAccount();
    await sleep(2000);

    await deployOralce();
    await setFulfillmentPermission();

    await createJob();
    await sleep(2000);
    
    await deployDataConsumer();
    await getAribtrSign();
    await callAddOracleAddJobId();

}
 

main();
