import mysql from "mysql"
import { loopItterations ,displayLogs, records10k, records100k, records200k, records500k, records1m } from "./settings.js";
let loops = loopItterations

let getMySql10kRows = []
let getMySql100kRows = []
let getMySql200kRows = []
let getMySql500kRows = []
let getMySql1mRows = []


async function startMySqlConnection(){
    const connection = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
        // database: process.env.DATABASE  // add local db in project later if possible
    });

    connection.connect((error) => {
        if(error){
            console.log('Error connecting to the MySQL Database');
            return;
        }
        if (displayLogs){
        console.log('Connection established successfully');
        }
    });
    return connection
}

async function closeMySqlConnection(connection){
    connection.end((err) => {
        if (err) {
            console.error('Error disconnecting from database: ', err.stack);
            return;
        }
        if (displayLogs){
        console.log('Disconnected from database.');
        }
    });
}

async function getMySqlRecordsMs(limit, connection){
    return new Promise((resolve, reject)=>{
        let elapsedTime
        const dbName = "user"
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
    let result = await getMySqlRecordsMs(records, connection)
    arr.push(result)
    await closeMySqlConnection(connection);
}

export async function loopMySqlTest(){
    for (let i = 0; i < loops ; i++) {
        await runMySqlTest();
    }
    await displayMySqlResult(records10k, getMySql10kRows, loops)
    await displayMySqlResult(records100k, getMySql100kRows, loops)
    await displayMySqlResult(records200k, getMySql200kRows, loops)
    await displayMySqlResult(records500k, getMySql500kRows, loops)
    await displayMySqlResult(records1m, getMySql1mRows, loops)
}
