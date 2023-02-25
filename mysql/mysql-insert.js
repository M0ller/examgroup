import * as dotenv from 'dotenv'

dotenv.config()
import {
    loopItterations,
    displayLogs,
    records10k,
    records100k,
    records200k,
    records500k,
    records1m,
} from "../settings.js";
import csv from "csvtojson"
import {closeMySqlConnection, startMySqlConnection} from "./mysql-server.js";

import fs from "fs"
import fastcsv from "fast-csv"

let loops = loopItterations
const dbName = process.env.MYSQL_TABLE
// const dbInsertName = process.env.MYSQL_TABLE
const dbInsertTableName = "user_insert"
const csvFilePath = "mysql/sudoku-test.txt"
// const csvFilePath = "raw-data/sudoku.txt"

let insertMySql10Rows = []
let insertMySql10kRows = []
let insertMySql100kRows = []
let insertMySql200kRows = []
let insertMySql500kRows = []
let insertMySql1mRows = []

///////////////////////

export async function createMysqlTable(connection) {
    // const query = `CREATE TABLE IF NOT EXISTS ${dbInsertTableName}( id int, puzzle text, solution double, clues int, difficulty double);`
    const query = `CREATE TABLE ${dbInsertTableName}
                   (
                       id         int,
                       puzzle     text,
                       solution   double,
                       clues      int,
                       difficulty double
                   );`
    connection.query(query, (error, results, fields) => {
        if (error) {
            throw error;
        } else {
            console.log(`Created Table ${dbInsertTableName}`)
        }
    })
}

export async function dropMysqlTable(connection) {
    // const query = `DROP TABLE IF EXISTS ${dbInsertTableName};`
    const query = `DROP TABLE ${dbInsertTableName}`
    connection.query(query, (error) => {
        if (error) {
            throw error;
        } else {
            console.log(`Dropped table ${dbInsertTableName}`)
        }
    })
}

export async function importCsvFile() {
    // test different in ms speed between csvtojson and fast-csv

    // return new Promise((resolve, reject) => {
    return csv({
        delimiter: ",",
        noheader: false,
    }).fromFile(csvFilePath).subscribe((jsonObj) => {
        return jsonObj
    })
    // }) // Promise


    // let stream = fs.createReadStream(csvFilePath);
    //
    // let csvStream = await fastcsv.parse()
    //     .on("data", function(data) {
    //         // console.log(data)
    //         csvData.push(data);
    //
    //     })
    //     .on("end", function() {
    //         // remove the first line: header
    //         csvData.shift();
    //
    //         // connect to the MySQL database
    //         // save csvData
    //     });
    // stream.pipe(csvStream);
}


export function ObjToArray(obj) {
    let arr = obj instanceof Array;

    return (arr ? obj : Object.keys(obj)).map(function (i) {
        let val = arr ? i : obj[i];
        if (typeof val === 'object')
            return ObjToArray(val);
        else
            return val;
    });
}

export async function insertMySqlRecordsMs(limit, connection, dataFile) {
    console.log("Limit: ", limit)
    return new Promise(async (resolve, reject) => {
        let elapsedTime
        const startTime = new Date();
        for (let i = 0; i < limit; i++) {
            const query = `INSERT INTO ${dbInsertTableName} (id, puzzle, solution, clues, difficulty)
                           VALUES (?)`;
            connection.query(query, [dataFile[i]], async (error, results, fields) => {
                if (error) {
                    console.log("Error: ", error);
                    reject(error)
                }
            }); // query
        }
        const endTime = new Date();
        elapsedTime = endTime - startTime
        if (displayLogs) {
            console.log(`MySQL Query: INSERT INTO ${dbInsertTableName}. From file "${csvFilePath}". Inserted ${limit} rows in ${elapsedTime} ms`);
        }
        console.log("elapsedTime: ", elapsedTime)
        resolve(elapsedTime)
    }); // Promise
}

async function displayMySqlInsertResult(records, arr, loops) {
    let sum = 0
    arr.forEach((e) => {
        sum += e;
    })
    console.log(`Average ms for MySQL insert  on ${records} records ran ${loops} times: `, sum / arr.length)
}


async function runMySqlInsertTest(dataFile) {

    await runOneMySqlInsertInstance(tempRecords, insertMySql10Rows, dataFile)

    // await runOneMySqlInsertInstance(records10k, getMySql10kRows)
    // await runOneMySqlInsertInstance(records100k, getMySql100kRows)
    // await runOneMySqlInsertInstance(records200k, getMySql200kRows)
    // await runOneMySqlInsertInstance(records500k, getMySql500kRows)
    // await runOneMySqlInsertInstance(records1m, getMySql1mRows)
}

async function runOneMySqlInsertInstance(records, arr, dataFile) {
    if (records <= dataFile.length) {
        let result
        const connection = await startMySqlConnection()
        await createMysqlTable(connection).then(async () => {
            await dropMysqlTable(connection)
        }).then(async () => {
            await closeMySqlConnection(connection);
        })
        // result = await insertMySqlRecordsMs(records, connection, dataFile)
        // arr.push(result)
        // } else {
        //     console.log("Table is not created yet")
        // }

    } else {
        console.log("Not enough rows in data file")
    }
}

let tempRecords = 10

export async function loopMySqlInsertTest() {

    console.log("Preparing data file... ")
    const startTime = new Date();
    const data = await importCsvFile()
    const endTime = new Date();
    let elapsedTime = endTime - startTime
    console.log("Loading complete, time: ", elapsedTime)
    let jsonArray = ObjToArray(data)

    for (let i = 0; i < loops; i++) {
        await runMySqlInsertTest(jsonArray);
    }
    await displayMySqlInsertResult(tempRecords, insertMySql10Rows, loops)
    // await displayMySqlInsertResult(records10k, insertMySql10kRows, loops)
    // await displayMySqlInsertResult(records100k, insertMySql100kRows, loops)
    // await displayMySqlInsertResult(records200k, insertMySql200kRows, loops)
    // await displayMySqlInsertResult(records500k, insertMySql500kRows, loops)
    // await displayMySqlInsertResult(records1m, insertMySql1mRows, loops)


}