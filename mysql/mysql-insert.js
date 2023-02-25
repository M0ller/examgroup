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

let loops = loopItterations
const dbName = process.env.MYSQL_TABLE
// const dbInsertName = process.env.MYSQL_TABLE
const dbInsertName = "user_insert"
// const csvFilePath = "./raw-data/sudoku.txt"
// const csvFilePath = "./mysql/sudoku-test.txt"

let getMySql10kRows = []
let getMySql100kRows = []
let getMySql200kRows = []
let getMySql500kRows = []
let getMySql1mRows = []

///////////////////////

export async function createMysqlTable() {
    const connection = await startMySqlConnection()
    const query = "CREATE TABLE user_insert (id int, puzzle text, solution double, clues int, difficulty double);"
    connection.query(query, async (error, results, fields) => {
        if (error) throw error;
        console.log("Error: ", error)
    })

    await closeMySqlConnection(connection)
}

export async function dropMysqlTable() {
    const connection = await startMySqlConnection()
    const query = "DROP TABLE user_insert;"
    connection.query(query, (error) => {
        if (error) {
            console.log("Error: Couldn't fine table to drop. ");
        } else {
            console.log("Dropped the table. user_insert")
        }
    })
    await closeMySqlConnection(connection)
}

import fs from "fs"
import fastcsv from "fast-csv"


// const csvFilePath = "./mysql/sudoku-text.txt"
const csvFilePath = "mysql/sudoku-test.txt"
// export let csvFile = []

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

// const jsonArray = await csv().fromFile(csvFilePath);
// export async function insertMySqlRecordsMs(connection){
export async function insertMySqlRecordsMs(limit) {
    console.log("Preparing data file... ")
    const startTime = new Date();
    const data = await importCsvFile()
    const endTime = new Date();
    let elapsedTime = endTime - startTime
    console.log("Loading complete, time: ", elapsedTime)

    let jsonArray = ObjToArray(data)
    let elapsedTimeArray = [];

    return new Promise(async (resolve, reject) => {
        const connection = await startMySqlConnection()
            let elapsedTime
        const startTime = new Date();
        for (let i = 0; i < limit; i++) {
            const query = `INSERT INTO ${dbInsertName} (id, puzzle, solution, clues, difficulty) VALUES (?)`;
            connection.query(query, [jsonArray[i]], async (error, results, fields) => {
                if (error) {
                    console.log(error);
                    reject(error)
                }
            }); // query
        }
        const endTime = new Date();
        elapsedTime = endTime - startTime
        elapsedTimeArray.push(elapsedTime)
        if (displayLogs) {
            console.log(`MySQL Query: INSERT INTO ${dbInsertName}. From file "${csvFilePath}". Inserted ${jsonArray.length} rows in ${elapsedTime} ms`);
        }
        console.log("elapsedTimeArray: ", elapsedTimeArray)
        resolve(elapsedTimeArray)
        await closeMySqlConnection(connection)
    }); // Promise
}





//////////// FROM GET


async function displayMySqlResult(records, arr, loops) {
    let sum = 0
    arr.forEach((e) => {
        sum += e;
    })
    console.log(`Average ms for MySQL   on ${records} records ran ${loops} times: `, sum / arr.length)
}


async function runMySqlTest() {
    await runOneMySqlInstance(records10k, getMySql10kRows)
    await runOneMySqlInstance(records100k, getMySql100kRows)
    await runOneMySqlInstance(records200k, getMySql200kRows)
    await runOneMySqlInstance(records500k, getMySql500kRows)
    await runOneMySqlInstance(records1m, getMySql1mRows)
}

async function runOneMySqlInstance(records, arr) {
    const connection = await startMySqlConnection()
    let result = await insertMySqlRecordsMs(records, connection)
    arr.push(result)
    await closeMySqlConnection(connection);
}

export async function loopMySqlGetTest() {
    for (let i = 0; i < loops; i++) {
        await runMySqlTest();
    }
    await displayMySqlResult(records10k, getMySql10kRows, loops)
    await displayMySqlResult(records100k, getMySql100kRows, loops)
    await displayMySqlResult(records200k, getMySql200kRows, loops)
    await displayMySqlResult(records500k, getMySql500kRows, loops)
    await displayMySqlResult(records1m, getMySql1mRows, loops)
}