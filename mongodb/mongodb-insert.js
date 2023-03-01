import * as dotenv from 'dotenv'
import {
    displayLogs,
    loopItterations,
    records100k,
    records10k,
    records1m,
    records200k,
    records500k,
} from "../settings.js";
import {importCsvFile, ObjToArray} from "../mysql/mysql-insert.js";
import {mongoClient} from "./mongodb-server.js";
dotenv.config()

let loops = loopItterations
const dbInsertCollectionName = process.env.MONGODB_INSERT_COLLECTION
const dbName = process.env.MONGODB_DATABASE
const filePath = process.env.FILE_PATH

let insertMongodb10kRows = []
let insertMongodb100kRows = []
let insertMongodb200kRows = []
let insertMongodb500kRows = []
let insertMongodb1mRows = []

export async function createMongodbCollection() { // singleton
    const client = mongoClient.getMongoClient()
    await client.connect()
    const db = await client.db(dbName)
    await db.createCollection(dbInsertCollectionName, function (err, res) {
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
    const client = mongoClient.getMongoClient()
    await client.connect()
    const db = await client.db(dbName)
    await db.dropCollection(dbInsertCollectionName, function (err, res) {
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

async function insertMongodbRecordsMs(limit, dataFile) {
    let elapsedTime
    let fileLimit = []
    for (let i = 0; i < limit; i++) {
        fileLimit.push(dataFile[i])
    }
    const client = mongoClient.getMongoClient()
    await client.connect()
    const db = await client.db(dbName)
    const startTime = new Date();
    await db.collection(dbInsertCollectionName).insertMany(fileLimit)
    client.close()
    const endTime = new Date()
    elapsedTime = endTime - startTime
    if (displayLogs) {
        console.log(`MySQL Query: INSERT INTO ${dbInsertCollectionName}. From file "${filePath}". Inserted ${limit} rows in ${elapsedTime} ms`);
    }
    return elapsedTime
}

async function displayMongodbInsertResult(records, arr, loops) {
    let sum = 0
    arr.forEach((e) => {
        sum += e;
    })
    console.log(`Average ms for MongoDB INSERT on ${records} records ran ${loops} times n/${loops}: `, sum / arr.length, " ms.")
}

async function runMongodbInsertTest(dataFile) {
    await runOneMongodbInsertInstance(records10k, insertMongodb10kRows, dataFile)
    await runOneMongodbInsertInstance(records100k, insertMongodb100kRows, dataFile)
    await runOneMongodbInsertInstance(records200k, insertMongodb200kRows, dataFile)
    await runOneMongodbInsertInstance(records500k, insertMongodb500kRows, dataFile)
    await runOneMongodbInsertInstance(records1m, insertMongodb1mRows, dataFile)
}

async function runOneMongodbInsertInstance(records, arr, dataFile) {
    if (records <= dataFile.length) {
        let result
        await createMongodbCollection() // param collection name
        result = await insertMongodbRecordsMs(records, dataFile)
        arr.push(result)
        await dropMongodbCollection()// param collection name
    } else {
        console.log("Not enough rows in data file")
    }
}

export async function loopMongodbInsertTest() {
    const startTimeTotal = new Date();

    console.log("Preparing data file... ")
    const startTime = new Date();
    const data = await importCsvFile()
    const endTime = new Date();
    let elapsedTime = endTime - startTime
    console.log("Loading complete, time: ", elapsedTime)
    let jsonArray = ObjToArray(data)

    for (let i = 0; i < loops; i++) {
        await runMongodbInsertTest(jsonArray);
    }
    await displayMongodbInsertResult(records10k, insertMongodb10kRows, loops)
    await displayMongodbInsertResult(records100k, insertMongodb100kRows, loops)
    await displayMongodbInsertResult(records200k, insertMongodb200kRows, loops)
    await displayMongodbInsertResult(records500k, insertMongodb500kRows, loops)
    await displayMongodbInsertResult(records1m, insertMongodb1mRows, loops)

    const endTimeTotal = new Date();
    let elapsedTimeTotal = endTimeTotal - startTimeTotal
    console.log("Total execution time: ", elapsedTimeTotal)
}