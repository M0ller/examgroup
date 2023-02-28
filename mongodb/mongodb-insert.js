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
const dbInsertTableName = process.env.MYSQL_INSERT_TABLE
const filePath = process.env.FILE_PATH
// const csvFilePath = "mysql/sudoku-test.txt"

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
    await db.createCollection("mongodb_insert", function (err, res) {
            console.log("MongoDB collection created!")
        if (err) {
            throw err;
        } else {
            console.log("MongoDB collection created!") // doesn't print the message. why?
            db.close()
        }
    })
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
    await client.close()
}

// export function createMongodbCollection(connection) {
//     return new Promise((resolve, reject) => {
//     // try {
//         const db = connection.db("examgroup")
//         db.createCollection("mongodb_insert", function (err, res) {
//             if (err) {
//                 reject()
//                 throw err;
//             }
//
//             console.log("Collection created!");
//             // db.close()
//         })
//         resolve()
//         console.log("Collection created!");
//     })
//
//     // } catch (e) {
//     //     console.log("Error: ", e)
//     // }
// }
//
//
// export function dropMongodbCollection(connection) {
//     return new Promise((resolve, reject) => {
//     // try {
//         const db = connection.db("examgroup")
//         db.dropCollection("mongodb_insert", function (err, del) {
//             if (err) {
//                 reject()
//                 throw err;
//             }
//             if (del) {
//                 resolve()
//             console.log("Collection deleted")
//             // db.close()
//             }
//         });
//     })
//     // }catch (e) {
//     //     console.log("Error: ", e)
//     // }
// }

async function insertMongodbRecordsMs(limit, connection, dataFile) {
    const startTime = new Date();
    let elapsedTime
    for (let i = 0; i < limit; i++) {
        new Promise((resolve, reject) => {
            const query = `INSERT INTO ${dbInsertTableName} (id, puzzle, solution, clues, difficulty)
                           VALUES (?)`;
            connection.query(query, [dataFile[i]], (error, results, fields) => {
                if (error) {
                    console.log("Error: ", error);
                    reject(error)
                }
            }); // query
            resolve()
        }); // Promise
    }
    const endTime = new Date()
    elapsedTime = endTime - startTime
    if (displayLogs) {
        console.log(`MySQL Query: INSERT INTO ${dbInsertTableName}. From file "${filePath}". Inserted ${limit} rows in ${elapsedTime} ms`);
    }
    return elapsedTime
}

async function displayMongodbInsertResult(records, arr, loops) {
    let sum = 0
    arr.forEach((e) => {
        sum += e;
    })
    console.log(`Average ms for MySQL insert  on ${records} records ran ${loops} times: `, sum / arr.length)
}

async function runMongodbInsertTest(dataFile) {
    await runOneMongodbInsertInstance(tempRecords, insertMongodb10Rows, dataFile) // remove later
    // await runOneMySqlInsertInstance(records10k, insertMySql10kRows, dataFile)
    // await runOneMySqlInsertInstance(records100k, insertMySql100kRows, dataFile)
    // await runOneMySqlInsertInstance(records200k, insertMySql200kRows, dataFile)
    // await runOneMySqlInsertInstance(records500k, insertMySql500kRows, dataFile)
    // await runOneMySqlInsertInstance(records1m, insertMySql1mRows, dataFile)
}

async function runOneMongodbInsertInstance(records, arr, dataFile) {
    if (records <= dataFile.length) {
        let result
        const connection = await startMySqlConnection()
        await createMongodbCollection(connection)
        result = await insertMongodbRecordsMs(records, connection, dataFile)
        arr.push(result)
        await dropMongodbCollection(connection)
        await closeMySqlConnection(connection);

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