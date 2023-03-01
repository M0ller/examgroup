import * as dotenv from 'dotenv'
dotenv.config()
import { loopItterations ,displayLogs, records10k, records100k, records200k, records500k, records1m } from "../settings.js";
import {closeMySqlConnection} from "./mysql-server.js";
import {getInstance} from "./mysql-singleton.js";
let loops = loopItterations
const dbName = process.env.MYSQL_TABLE

let getMySql10kRows = []
let getMySql100kRows = []
let getMySql200kRows = []
let getMySql500kRows = []
let getMySql1mRows = []

async function getMySqlRecordsMs(limit, connection){
    return new Promise((resolve, reject)=>{
        let elapsedTime
        const startTime = new Date();

        const query = `SELECT * FROM ${dbName} LIMIT ${limit}`;
        connection.query(query, async (error, results, fields) => {
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

async function displayMySqlResult(records, arr, loops){
    let sum = 0
    arr.forEach((e)=>{
        sum += e;
    })
    console.log(`Average ms for MySQL SELECT on ${records} records ran ${loops} times n/${loops}: `, sum / arr.length, " ms.")
}


async function runMySqlTest(){
    await runOneMySqlInstance(records10k, getMySql10kRows)
    await runOneMySqlInstance(records100k, getMySql100kRows)
    await runOneMySqlInstance(records200k, getMySql200kRows)
    await runOneMySqlInstance(records500k, getMySql500kRows)
    await runOneMySqlInstance(records1m, getMySql1mRows)
}

async function runOneMySqlInstance(records, arr){
    const connection = getInstance()
    let result = await getMySqlRecordsMs(records, connection)
    arr.push(result)
    //await closeMySqlConnection(connection);
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
