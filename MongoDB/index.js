import {MongoClient} from 'mongodb';
const dbName = 'examgroup'
const collectionName = 'user'
const uri = "mongodb://127.0.0.1";
let loops = 1

let getMongoDb10kRows = []
let getMongoDb100kRows = []
let getMongoDb200kRows = []
let getMongoDb500kRows = []
let getMongoDb1mRows = []
let records10k = 10000
let records100k = 100000
let records200k = 200000
let records500k = 500000
let records1m = 1000000

async function startMongoConnection(){
    const connection = new MongoClient(uri);

    try {
    await connection.connect();
    }catch (e){
        console.log(e)
    }
    return connection
}

async function closeMongoConnection(connection){
    await connection.close();
}

async function getMongoRecordsMs(limit, connection){
    return new Promise(async (resolve, reject) => {
        let elapsedTime
        let data
        const db = connection.db(dbName);
        const collection = db.collection(collectionName);
        try {
            const startTime = new Date().getTime();
            data = await collection.find().limit(limit).toArray();
            const endTime = new Date().getTime();
            elapsedTime = endTime - startTime
            resolve(elapsedTime)
            console.log({message: `Time taken: ${endTime - startTime}ms`, result: data.length});
        } catch (e){
            reject()
        }
    });
}

async function displayMongoResult(records, arr, loops){
    let sum = 0
    arr.forEach((e)=>{
        sum += e;
    })
    console.log(`"Average ms for ${records} records ran ${loops} times: `, sum / arr.length)
}


async function runMongoTest(){
    // const connection = await startMongoConnection()
    //
    // // run 10k records
    // let result10k = await getMongoRecordsMs(records10k, connection)
    // getMongoDb10kRows.push(result10k)
    //
    // // run 100k records
    // let result100k = await getMongoRecordsMs(records100k, connection)
    // getMongoDb100kRows.push(result100k)
    //
    // // run 200k records
    // let result200k = await getMongoRecordsMs(records200k, connection)
    // getMongoDb200kRows.push(result200k)
    //
    // // run 500k records
    // let result500k = await getMongoRecordsMs(records500k, connection)
    // getMongoDb500kRows.push(result500k)
    //
    // // run 1m records
    // let result1m = await getMongoRecordsMs(records1m, connection)
    // getMongoDb1mRows.push(result1m)
    // await closeMongoConnection(connection);

    await runOneMongoInstance(records10k, getMongoDb10kRows)
    await runOneMongoInstance(records100k, getMongoDb100kRows)
    await runOneMongoInstance(records200k, getMongoDb200kRows)
    await runOneMongoInstance(records500k, getMongoDb500kRows)
    await runOneMongoInstance(records1m, getMongoDb1mRows)
}

async function runOneMongoInstance(records, arr){
    const connection = await startMongoConnection()
    let result = await getMongoRecordsMs(records, connection)
    arr.push(result)
    await closeMongoConnection(connection);
}

async function loopMongoTest(){
    for (let i = 0; i < loops; i++) {
        await runMongoTest();
    }
    await displayMongoResult(records10k, getMongoDb10kRows, loops)
    await displayMongoResult(records100k, getMongoDb100kRows, loops)
    await displayMongoResult(records200k, getMongoDb200kRows, loops)
    await displayMongoResult(records500k, getMongoDb500kRows, loops)
    await displayMongoResult(records1m, getMongoDb1mRows, loops)
}


await loopMongoTest();
