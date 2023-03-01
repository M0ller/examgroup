import * as dotenv from 'dotenv'
import { loopItterations, displayLogs, records10k, records100k, records200k, records500k, records1m } from "../settings.js";
import { mongoClient } from "./mongodb-server.js";
import {importCsvFile, ObjToArray} from "../mysql/mysql-insert.js";
dotenv.config()

let loops = loopItterations
const dbName = process.env.MONGODB_DATABASE
const collectionName = process.env.MONGODB_COLLECTION


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

function displayMongoResult(records, arr, loops){
    let sum = 0
    arr.forEach((e)=>{
        sum += e;
    })
    console.log(`Average ms for MongoDB SELECT on ${records} records ran ${loops} times n/${loops}: `, sum / arr.length, " ms.")
}

async function runMongoInstance(loops, records){
    let arr = []
    for (let i = 0; i < loops; i++) {
    let result = await getMongoRecordsMs(records)
    arr.push(result)
    }
    displayMongoResult(records10k, arr, loops)
}

export async function loopMongoGetTest(){
    console.log("Starting MongoDB Get Test ")
    const startTime = new Date();

    await runMongoInstance(loops, records10k)
    // await runMongoInstance(loops, records100k)
    // await runMongoInstance(loops, records200k)
    // await runMongoInstance(loops, records500k)
    // await runMongoInstance(loops, records1m)

    const endTime = new Date();
    let elapsedTime = endTime - startTime
    console.log("Total execution time: ", elapsedTime)
}


