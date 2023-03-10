import * as dotenv from 'dotenv'
import {
    displayLogs, dropTables,
    loopItterations,
    records100k,
    records10k,
    records1m,
    records200k,
    records500k,
} from "../settings.js";
import {importCsvFile} from "../mysql/mysql-insert.js";
import {MongoClient} from "mongodb";
import {uri} from "./mongodb-server.js";
import fs from "fs";
dotenv.config()

let loops = loopItterations
const dbInsertCollectionName = process.env.MONGODB_INSERT_COLLECTION
const dbName = process.env.MONGODB_DATABASE
const filePath = process.env.FILE_PATH


export async function createMongodbCollection() {
    // const client = mongoClient.getMongoClient()
    const client = new MongoClient(uri)
    await client.connect()
    const db = await client.db(dbName)
    await db.createCollection(dbInsertCollectionName, function (err) {
        if (err) {
            throw err;
        } else {
            console.log("MongoDB collection created!") // doesn't print the message. why?
            db.close()
        }
    })
    if (displayLogs) {
        console.log(`MongoDB collection ${dbInsertCollectionName} created!`)
    }
    await client.close()
}

export async function dropMongodbCollection() { // singleton
    // const client = mongoClient.getMongoClient()
    const client = new MongoClient(uri)
    await client.connect()
    const db = await client.db(dbName)
    await db.dropCollection(dbInsertCollectionName, function (err) {
        if (err) {
            throw err;
        } else {
            console.log("MongoDB collection dropped!") // doesn't print the message. why?
            db.close()
        }
    });
    if (displayLogs) {
    console.log(`MongoDB collection ${dbInsertCollectionName} dropped!`)
    }
    await client.close()
}

// InsertMany
async function insertMongodbRecordsMs(limit, dataFile) {
    let elapsedTime
    let fileLimit = []
    for (let i = 0; i < limit; i++) {
        fileLimit.push(dataFile[i])
    }
    const client = new MongoClient(uri)
    await client.connect()
    const db = await client.db(dbName)
    const startTime = new Date();
    await db.collection(dbInsertCollectionName).insertMany(fileLimit)
    await client.close()
    const endTime = new Date()
    elapsedTime = endTime - startTime
    if (displayLogs) {
        console.log(`MongoDB Query: INSERT INTO ${dbInsertCollectionName}. From file "${filePath}". Inserted ${limit} rows in ${elapsedTime} ms`);
    }
    return elapsedTime
}

function displayMongodbInsertResult(records, arr, loops) {
    let sum = 0
    arr.forEach((e) => {
        sum += e;
    })
    let result =  sum / arr.length
    console.log(`Average ms for MongoDB INSERT on ${records} records ran ${loops} times n/${loops}: `, result, " ms.")
    fs.appendFile('mongodb_insert_result.txt', result.toString() + "\n", (err)=>{
        if (err) throw err;
    })
    if (displayLogs) {
        console.log(`MySQL Array of all estimated times: ${arr}`);
    }
}

async function runMongodbInsertInstance(loops, records, dataFile) {
    if (records <= dataFile.length) {
    let arr = []
    for (let i = 0; i < loops; i++) {
        await createMongodbCollection() // param collection name
        let result = await insertMongodbRecordsMs(records, dataFile)
        if(dropTables){
        await dropMongodbCollection()// param collection name
        }
        arr.push(result)
    }
    displayMongodbInsertResult(records, arr, loops)
    } else {
        console.log("Not enough rows in data file")
    }
}

export async function loopMongodbInsertTest() {
    const startTimeTotal = new Date();
    if (displayLogs) {
    console.log("Starting MongoDB Insert Test")
    console.log("Preparing data file... ")
    }
    const startTime = new Date();
    const data = await importCsvFile()
    const endTime = new Date();
    let elapsedTime = endTime - startTime
    if (displayLogs) {
    console.log("Loading complete, time: ", elapsedTime)
    }

    await runMongodbInsertInstance(loops, records10k, data)
    // await runMongodbInsertInstance(loops, records100k, data)
    // await runMongodbInsertInstance(loops, records200k, data)
    // await runMongodbInsertInstance(loops, records500k, data)
    // await runMongodbInsertInstance(loops, records1m, data)

    const endTimeTotal = new Date();
    let elapsedTimeTotal = endTimeTotal - startTimeTotal
    if (displayLogs) {
    console.log("Total execution time: ", elapsedTimeTotal)
    }
}