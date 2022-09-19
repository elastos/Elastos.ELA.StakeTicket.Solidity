const { 
    sleep ,
    clearPostgres,
    clearChainLink,
    startPostgres,
    startChainlink
} = require('./helper')

const main = async () => {

    //clear postgres
    await clearPostgres();
    await sleep(2000);

    //clear chainLink
    await clearChainLink();
    await sleep(2000);

    //start postgres
    await startPostgres();
    await sleep(30000);

    //start start chainlink
    await startChainlink();
   
}
 
main();
