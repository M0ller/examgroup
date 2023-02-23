import {MongoClient} from 'mongodb';
const dbName = 'examgroup'
const collectionName = 'user'
const uri = "mongodb://127.0.0.1";

import { loopItterations , records10k, records100k, records200k, records500k, records1m } from "./settings.js";
let loops = loopItterations

let getMongoDb10kRows = []
let getMongoDb100kRows = []
let getMongoDb200kRows = []
let getMongoDb500kRows = []
let getMongoDb1mRows = []

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

export async function loopMongoTest(){
    for (let i = 0; i < loop; i++) {
        await runMongoTest();
    }
    await displayMongoResult(records10k, getMongoDb10kRows, getLoopItterations)
    await displayMongoResult(records100k, getMongoDb100kRows, getLoopItterations)
    await displayMongoResult(records200k, getMongoDb200kRows, getLoopItterations)
    await displayMongoResult(records500k, getMongoDb500kRows, getLoopItterations)
    await displayMongoResult(records1m, getMongoDb1mRows, getLoopItterations)
}


