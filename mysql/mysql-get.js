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
    run10K, run100K, run500K, run200K, run1m
} from "../settings.js";
import * as fs from "fs";
let loops = loopItterations
const dbName = process.env.MYSQL_TABLE

async function getMySqlRecordsMs(limit, connection){
    return new Promise((resolve, reject)=>{
        let elapsedTime
        const query = `SELECT * FROM ${dbName} LIMIT ${limit}`;
        const startTime = new Date();

        connection.query(query, async (error, results) => {
            if (error) {
                console.log(error);
                reject(error)
            }else{
                const endTime = new Date();
                elapsedTime = endTime - startTime;
                if (displayLogs) {
                    console.log(`MySQL Query: "SELECT * FROM ${dbName} LIMIT ${limit}". Got ${results.length} rows in ${elapsedTime} ms`);
                }
                resolve(elapsedTime)
            }
        });
    });
}

function displayMySqlResult(records, arr, loops){
    let sum = 0
    arr.forEach((e)=>{
        sum += e;
    })
    let result =  sum / arr.length
    console.log(`Average ms for MySQL SELECT on ${records} records ran ${loops} times n/${loops}: `, result, " ms.")
    fs.appendFile('mysql_select_result.txt', result.toString() + "\n", (err)=>{
        if (err) throw err;
    })
}

async function runMySqlGetTest(loops, records, connection) {
    let arr = [];
    for (let i = 0; i < loops; i++) {
        let result = await getMySqlRecordsMs(records, connection)
        arr.push(result)
    }
    displayMySqlResult(records, arr, loops)
}

export async function loopMySqlGetTest(connection){

    if (displayLogs) {
    console.log("Starting MySQL SELECT Test")
    }
    const startTime = new Date();

    if(run10K) await runMySqlGetTest(loops, records10k, connection);
    if(run100K) await runMySqlGetTest(loops, records100k, connection);
    if(run200K) await runMySqlGetTest(loops, records200k, connection);
    if(run500K) await runMySqlGetTest(loops, records500k, connection);
    if(run1m) await runMySqlGetTest(loops, records1m, connection);

    const endTime = new Date();
    let elapsedTime = endTime - startTime
    if (displayLogs) {
    console.log("Loading complete, time: ", elapsedTime)
    }
}
