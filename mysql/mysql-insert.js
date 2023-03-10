import * as dotenv from 'dotenv'
import {
    displayLogs, dropTables,
    loopItterations,
    records100k,
    records10k,
    records1m,
    records200k,
    records500k, recordsCustom, run100K, run10K, run1m, run200K, run500K, runCustom,
} from "../settings.js";
import csv from "csvtojson"
import fs from "fs";

dotenv.config()

let loops = loopItterations
const dbInsertTableName = process.env.MYSQL_INSERT_TABLE
const filePath = process.env.FILE_PATH

async function createMysqlTable(connection) {
    // await dropMysqlTable(connection) // making sure the table is dropped
    const query = `CREATE TABLE IF NOT EXISTS ${dbInsertTableName}
                      (
                          row_nr     int auto_increment
                                     primary key,
                          id         int    null,
                          puzzle     text   null,
                          solution   double null,
                          clues      int    null,
                          difficulty double null
                      );`

    return new Promise((resolve, reject) => {
        connection.query(query, (error) => {
            if (error) {
                reject()
                throw error;
            } else {
                if (displayLogs) {
                    console.log(`Created Table ${dbInsertTableName}`)
                }
                resolve()
            }
        })
    });
}

function dropMysqlTable(connection) {
    const query = `DROP TABLE IF EXISTS ${dbInsertTableName};`
    return new Promise((resolve, reject) => {
        connection.query(query, (error) => {
            if (error) {
                reject()
                throw error;
            } else {
                if (displayLogs) {
                    console.log(`Dropped table ${dbInsertTableName}`)
                }
                resolve()
            }
        })
    });
}

export async function importCsvFile() {
    return csv({
        delimiter: ",",
        noheader: false,
    }).fromFile(filePath).subscribe((jsonObj) => {
        return jsonObj
    })
}

// Insert without converting csv file using ObjToArray
async function insertMySqlRecordsMs(limit, connection, dataFile) {
    const startTime = new Date();
    let elapsedTime
    for (let i = 0; i < limit; i++) {
        new Promise((resolve, reject) => {
            try {
                const query = `INSERT INTO ${dbInsertTableName} (id, puzzle, solution, clues, difficulty)
                           VALUES (?,?,?,?,?)`;
                connection.query(query, [dataFile[i].id, dataFile[i].puzzle ,dataFile[i].solution ,dataFile[i].clues,dataFile[i].difficulty], (error) => {
                    if (error) {
                        console.log("Error: ", error);
                        reject(error)
                    }
                }); // query
                resolve()
            }catch (e){
                reject()
            }
        }); // Promise
    }
    const endTime = new Date()
    elapsedTime = endTime - startTime
    if (displayLogs) {
        console.log(`MySQL Query: INSERT INTO ${dbInsertTableName}. From file "${filePath}". Inserted ${limit} rows in ${elapsedTime} ms`);
    }
    return elapsedTime
}

function displayMySqlInsertResult(records, arr, loops) {
    let sum = 0
    arr.forEach((e) => {
        sum += e;
    })
    let result =  sum / arr.length
    console.log(`Average ms for MySQL INSERT on ${records} records ran ${loops} times n/${loops}: `, result, " ms.")
    fs.appendFile('mysql_insert_result.txt', result.toString() + "\n", (err)=>{
        if (err) throw err;
    })
    if (displayLogs) {
        console.log(`MySQL Array of all estimated times: ${arr}`);
    }
}

async function runMySqlInsertTest(loops, dataFile, records, connection) {
    if (records <= dataFile.length) {
        let arr = [];
        for (let i = 0; i < loops; i++) {
            await createMysqlTable(connection)
            let result = await insertMySqlRecordsMs(records, connection, dataFile)
            if(dropTables){
            await dropMysqlTable(connection)
            }
            arr.push(result)
        }
        displayMySqlInsertResult(records, arr, loops)
    } else {
        console.log("Not enough rows in data file")
    }
}

export async function loopMySqlInsertTest(connection) {
    console.log("Starting MySQL INSERT Test ")
        const startTimeTotal = new Date();
        console.log("Preparing data file...")
        const startTime = new Date();
        const data = await importCsvFile()
        const endTime = new Date();
        let elapsedTime = endTime - startTime
        console.log("Loading complete, time: ", elapsedTime)
        // let jsonArray = ObjToArray(data)

        if(runCustom) await runMySqlInsertTest(loops, data, recordsCustom, connection);
        if(run10K) await runMySqlInsertTest(loops, data, records10k, connection);
        if(run100K) await runMySqlInsertTest(loops, data, records100k, connection);
        if(run200K) await runMySqlInsertTest(loops, data, records200k, connection);
        if(run500K) await runMySqlInsertTest(loops, data, records500k, connection);
        if(run1m) await runMySqlInsertTest(loops, data, records1m, connection);

        const endTimeTotal = new Date();
        let elapsedTimeTotal = endTimeTotal - startTimeTotal
        console.log("Total execution time: ", elapsedTimeTotal)
}