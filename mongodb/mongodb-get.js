import * as dotenv from 'dotenv'
dotenv.config()
const dbName = process.env.MONGODB_DATABASE
const collectionName = process.env.MONGODB_COLLECTION


import { loopItterations, displayLogs, records10k, records100k, records200k, records500k, records1m } from "../settings.js";
import { mongoClient } from "./mongodb-server.js";
let loops = loopItterations

let getMongoDb10kRows = []
let getMongoDb100kRows = []
let getMongoDb200kRows = []
let getMongoDb500kRows = []
let getMongoDb1mRows = []

async function getMongoRecordsMs(limit){
    return new Promise(async (resolve, reject) => {
        let elapsedTime
        let result
        const client = mongoClient.getMongoClient()
        await client.connect()
        const db = await client.db(dbName)
        const collection = db.collection(collectionName);
        try {
            const startTime = new Date().getTime();
            result = await collection.find().limit(limit).toArray();
            const endTime = new Date().getTime();
            await client.close()
            elapsedTime = endTime - startTime
            resolve(elapsedTime)
            if (displayLogs){
            console.log(`MongoDB Query: "SELECT * FROM ${dbName} LIMIT ${limit}". Got ${result.length} rows in ${elapsedTime} ms`);
            }
        } catch (e){
            await client.close()
            reject()
        }
    });
}

async function displayMongoResult(records, arr, loops){
    let sum = 0
    arr.forEach((e)=>{
        sum += e;
    })
    console.log(`Average ms for MongoDB SELECT on ${records} records ran ${loops} times n/${loops}: `, sum / arr.length, " ms.")
}

async function runOneMongoInstance(records, arr){
    let result = await getMongoRecordsMs(records)
    arr.push(result)
}

async function runMongoTest(){
    await runOneMongoInstance(records10k, getMongoDb10kRows)
    await runOneMongoInstance(records100k, getMongoDb100kRows)
    await runOneMongoInstance(records200k, getMongoDb200kRows)
    await runOneMongoInstance(records500k, getMongoDb500kRows)
    await runOneMongoInstance(records1m, getMongoDb1mRows)
}

export async function loopMongoGetTest(){
    for (let i = 0; i < loops; i++) {
        await runMongoTest();
    }
    await displayMongoResult(records10k, getMongoDb10kRows, loops)
    await displayMongoResult(records100k, getMongoDb100kRows, loops)
    await displayMongoResult(records200k, getMongoDb200kRows, loops)
    await displayMongoResult(records500k, getMongoDb500kRows, loops)
    await displayMongoResult(records1m, getMongoDb1mRows, loops)
}


