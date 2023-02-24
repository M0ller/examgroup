import * as dotenv from 'dotenv'
dotenv.config()
import { loopItterations ,displayLogs, records10k, records100k, records200k, records500k, records1m } from "../settings.js";
import csv from "csvtojson"
import { closeMySqlConnection, startMySqlConnection } from "./mysql-server.js";
let loops = loopItterations
const dbName = process.env.MYSQL_TABLE

let getMySql10kRows = []
let getMySql100kRows = []
let getMySql200kRows = []
let getMySql500kRows = []
let getMySql1mRows = []

///////////////////////

export async function createMysqlTable(){
    const connection = await startMySqlConnection()
    const query = "CREATE TABLE user_insert (id int, puzzle text, solution double, clues int, difficulty double);"
    connection.query(query, async (error, results, fields)=>{
        if (error) throw error;
        console.log("Error: ", error)
    })

    await closeMySqlConnection(connection)
}

export async function dropMysqlTable(){
    const connection = await startMySqlConnection()
    const query = "DROP TABLE user_insert;"
    connection.query(query, (error)=>{
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
const csvFilePath = "./mysql/sudoku-test.txt"

export async function importCsvFile(){
    let csvData = [];
    // test different in ms speed between csvtojson and fast-csv
    csv({
        delimiter: ",",
        noheader:false,
    }).fromFile(csvFilePath).then((jsonObj)=>{
        csvData.push(jsonObj)
        console.log(jsonObj)
    })

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
    return csvData
}


// const jsonArray = await csv().fromFile(csvFilePath);
// export async function insertMySqlRecordsMs(connection){
export async function insertMySqlRecordsMs(){
    const connection = await startMySqlConnection()

    return new Promise(async (resolve, reject) => {
        let elapsedTime
        const startTime = new Date();
        // const data = await importCsvFile()
        const data = [{id:1, puzzle: 1, solution: 1, clues: 1, difficulty: 1}, {id:2, puzzle: 2, solution: 2, clues: 2, difficulty: 2}]

        let jsonArray = ObjToArray(data)
        console.log("jsonArray: ", jsonArray)
        // const data = "1, 50, 23, 5, 40"
        const dataString = JSON.stringify(data)
        const query = `INSERT INTO user_insert (id, puzzle, solution, clues, difficulty) VALUES (?)`;
        // console.log(dataString)

        jsonArray.forEach((e)=>{
            connection.query(query, [e], async (error, results, fields) => {
                if (error) {
                    console.log(error);
                    reject(error)
                } else {
                    const endTime = new Date();
                    elapsedTime = endTime - startTime;
                    if (displayLogs) {
                        console.log(`MySQL Query: INSERT INTO user_insert VALUES ${data}. inserted ${data.length} rows in ${elapsedTime} ms`);
                    }
                    resolve(elapsedTime)
                }
            });
        })

        await closeMySqlConnection(connection)
    });
}


function ObjToArray(obj) {
    let arr = obj instanceof Array;

    return (arr ? obj : Object.keys(obj)).map(function(i) {
        let val = arr ? i : obj[i];
        if(typeof val === 'object')
            return ObjToArray(val);
        else
            return val;
    });
}









//////////// FROM GET


async function displayMySqlResult(records, arr, loops){
    let sum = 0
    arr.forEach((e)=>{
        sum += e;
    })
    console.log(`Average ms for MySQL   on ${records} records ran ${loops} times: `, sum / arr.length)
}


async function runMySqlTest(){
    await runOneMySqlInstance(records10k, getMySql10kRows)
    await runOneMySqlInstance(records100k, getMySql100kRows)
    await runOneMySqlInstance(records200k, getMySql200kRows)
    await runOneMySqlInstance(records500k, getMySql500kRows)
    await runOneMySqlInstance(records1m, getMySql1mRows)
}

async function runOneMySqlInstance(records, arr){
    const connection = await startMySqlConnection()
    let result = await insertMySqlRecordsMs(records, connection)
    arr.push(result)
    await closeMySqlConnection(connection);
}

export async function loopMySqlGetTest(){
    for (let i = 0; i < loops ; i++) {
        await runMySqlTest();
    }
    await displayMySqlResult(records10k, getMySql10kRows, loops)
    await displayMySqlResult(records100k, getMySql100kRows, loops)
    await displayMySqlResult(records200k, getMySql200kRows, loops)
    await displayMySqlResult(records500k, getMySql500kRows, loops)
    await displayMySqlResult(records1m, getMySql1mRows, loops)
}