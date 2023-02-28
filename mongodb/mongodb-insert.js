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
const dbInsertCollectionName = process.env.MONGODB_COLLECTION
const filePath = process.env.FILE_PATH

let tempRecords = 10
let insertMongodb10Rows = []
let insertMongodb10kRows = []
let insertMongodb100kRows = []
let insertMongodb200kRows = []
let insertMongodb500kRows = []
let insertMongodb1mRows = []

export async function createMongodbCollection() { // singleton
    const client = mongoClient.getMongoClient()
    await client.connect()
    const db = await client.db("examgroup")

    // TODO error check if there already exist a collection with the same name
    // db.listCollections({ name: "mycollection" }).next(function(err, collinfo) {
    //     if (collinfo) {
    //         console.log("Collection exists");
    //     } else {
    //         console.log("Collection does not exist");
    //     }

    await db.createCollection("mongodb_insert", { autoIndexId: true }, function (err, res) {
            console.log("MongoDB collection created!")
        if (err) {
            throw err;
        } else {
            console.log("MongoDB collection created!") // doesn't print the message. why?
            db.close()
        }
    })
    if (displayLogs) {
        console.log(`MongoDB collection created! mongodb_insert`); // put in a param ${mongodb_insert}
    }
    await client.close()
}


export async function dropMongodbCollection() { // singleton
    const client = mongoClient.getMongoClient()
    await client.connect()

    const db = await client.db("examgroup")
    await db.dropCollection("mongodb_insert", function (err, res) {
        if (err) {
            throw err;
        } else {
            console.log("MongoDB collection dropped!") // doesn't print the message. why?
            db.close()
        }
    });

    if (displayLogs) {
        console.log(`MongoDB collection dropped! mongodb_insert`); // put in a param ${mongodb_insert}
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
    const db = await client.db("examgroup")
    const startTime = new Date();
    await db.collection("mongodb_insert").insertMany(fileLimit)
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
    console.log(`Average ms for MongoDb insert  on ${records} records ran ${loops} times: `, sum / arr.length)
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

    for (let i = 0; i < loops; i++) {
        await runMongodbInsertTest(data);
    }
    await displayMongodbInsertResult(tempRecords, insertMongodb10Rows, loops)
    await displayMongodbInsertResult(records10k, insertMongodb10kRows, loops)
    await displayMongodbInsertResult(records100k, insertMongodb100kRows, loops)
    await displayMongodbInsertResult(records200k, insertMongodb200kRows, loops)
    await displayMongodbInsertResult(records500k, insertMongodb500kRows, loops)
    await displayMongodbInsertResult(records1m, insertMongodb1mRows, loops)

    const endTimeTotal = new Date();
    let elapsedTimeTotal = endTimeTotal - startTimeTotal
    console.log("Total execution time: ", elapsedTimeTotal)
}
