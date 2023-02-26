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
import csv from "csvtojson"
import {closeMySqlConnection, startMySqlConnection} from "./mysql-server.js";

dotenv.config()

let loops = loopItterations
const dbName = process.env.MYSQL_TABLE
// const dbInsertName = process.env.MYSQL_TABLE
const dbInsertTableName = "user_insert"
// const csvFilePath = "mysql/sudoku-test.txt"
// const csvFilePath = "raw-data/sudoku.txt"
const csvFilePath = "raw-data/sudoku-1m.txt"

let tempRecords = 10
let insertMySql10Rows = []
let insertMySql10kRows = []
let insertMySql100kRows = []
let insertMySql200kRows = []
let insertMySql500kRows = []
let insertMySql1mRows = []

///////////////////////
// return new Promise((resolve, reject) => {}); // Promise

function createMysqlTable(connection) {
    const query = `CREATE TABLE IF NOT EXISTS ${dbInsertTableName}( id int, puzzle text, solution double, clues int, difficulty double) ;` // can add "ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=16;" in the end of create table, should optimize the table

    return new Promise((resolve, reject) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                reject()
                throw error;
            } else {
                resolve()
                console.log(`Created Table ${dbInsertTableName}`)
            }
        }) // Query
    }); // Promise

}

function optimizeMysqlTable(connection){
    return new Promise((resolve, reject) => {
        const query = `OPTIMIZE TABLE ${dbInsertTableName}`
        connection.query(query, (error, results, fields) => {
            if (error) {
                reject()
                throw error;
            } else {
                resolve()
                console.log(`Optimized Table ${dbInsertTableName}`)
            }
        }) // Query
    }); // Promise
}
function dropMysqlTable(connection) {
    const query = `DROP TABLE IF EXISTS ${dbInsertTableName};`
    return new Promise((resolve, reject) => {
        connection.query(query, (error) => {
            if (error) {
                reject()
                throw error;
            } else {
                resolve()
                console.log(`Dropped table ${dbInsertTableName}`)
            }
        }) // Query
    }); // Promise
}


export async function importCsvFile() {
    // test different in ms speed between csvtojson and fast-csv

    // return new Promise((resolve, reject) => {
    return csv({
        delimiter: ",",
        noheader: false,
    }).fromFile(csvFilePath).subscribe((jsonObj) => {
        return jsonObj
        //     if(jsonObj){
        //     resolve(jsonObj)
        //     } else {
        //         reject(jsonObj)
        //     }
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

async function insertMySqlRecordsMs(limit, connection, dataFile) {
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
        console.log(`MySQL Query: INSERT INTO ${dbInsertTableName}. From file "${csvFilePath}". Inserted ${limit} rows in ${elapsedTime} ms`);
    }
    console.log("elapsedTime: ", elapsedTime)
    return elapsedTime
}

async function displayMySqlInsertResult(records, arr, loops) {
    let sum = 0
    arr.forEach((e) => {
        sum += e;
    })
    console.log(`Average ms for MySQL insert  on ${records} records ran ${loops} times: `, sum / arr.length)
}

async function runMySqlInsertTest(dataFile) {
    // await runOneMySqlInsertInstance(tempRecords, insertMySql10Rows, dataFile) // remove later
    await runOneMySqlInsertInstance(records10k, insertMySql10kRows, dataFile)
    // await runOneMySqlInsertInstance(records100k, insertMySql100kRows, dataFile)
    // await runOneMySqlInsertInstance(records200k, insertMySql200kRows, dataFile)
    // await runOneMySqlInsertInstance(records500k, insertMySql500kRows, dataFile)
    // await runOneMySqlInsertInstance(records1m, insertMySql1mRows, dataFile)
}

async function runOneMySqlInsertInstance(records, arr, dataFile) {
    if (records <= dataFile.length) {
        let result
        const connection = await startMySqlConnection()
        await createMysqlTable(connection)
        await optimizeMysqlTable(connection)
        result = await insertMySqlRecordsMs(records, connection, dataFile)
        arr.push(result)
        await dropMysqlTable(connection)
        await closeMySqlConnection(connection);

    } else {
        console.log("Not enough rows in data file")
    }
}


export async function loopMySqlInsertTest() {
    const startTimeTotal = new Date();

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
    await displayMySqlInsertResult(records10k, insertMySql10kRows, loops)
    await displayMySqlInsertResult(records100k, insertMySql100kRows, loops)
    await displayMySqlInsertResult(records200k, insertMySql200kRows, loops)
    await displayMySqlInsertResult(records500k, insertMySql500kRows, loops)
    await displayMySqlInsertResult(records1m, insertMySql1mRows, loops)

    const endTimeTotal = new Date();
    let elapsedTimeTotal = endTimeTotal - startTimeTotal
    console.log("Total execution time: ", elapsedTimeTotal)
}