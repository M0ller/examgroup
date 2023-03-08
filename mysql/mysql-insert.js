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

// Insert without converting csv file using ObjToArray
async function insertMySqlRecordsMs(limit, connection, dataFile) {
    const startTime = new Date();
    let elapsedTime

    for (let i = 0; i < limit; i++) {
        new Promise((resolve, reject) => {
            const query = `INSERT INTO ${dbInsertTableName} (id, puzzle, solution, clues, difficulty)
                           VALUES (?,?,?,?,?)`;
            connection.query(query, [dataFile[i].id, dataFile[i].puzzle ,dataFile[i].solution ,dataFile[i].clues,dataFile[i].difficulty ], (error) => {
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


// Old
// async function insertMySqlRecordsMs(limit, connection, dataFile) {
//     const startTime = new Date();
//     let elapsedTime
//     for (let i = 0; i < limit; i++) {
//         new Promise((resolve, reject) => {
//             const query = `INSERT INTO ${dbInsertTableName} (id, puzzle, solution, clues, difficulty)
//                            VALUES (?)`;
//             connection.query(query, [dataFile[i]], (error) => {
//                 if (error) {
//                     console.log("Error: ", error);
//                     reject(error)
//                 }
//             }); // query
//             resolve()
//         }); // Promise
//     }
//     const endTime = new Date()
//     elapsedTime = endTime - startTime
//     if (displayLogs) {
//         console.log(`MySQL Query: INSERT INTO ${dbInsertTableName}. From file "${filePath}". Inserted ${limit} rows in ${elapsedTime} ms`);
//     }
//     return elapsedTime
// }

function displayMySqlInsertResult(records, arr, loops) {
    let sum = 0
    arr.forEach((e) => {
        sum += e;
    })
    console.log(`Average ms for MySQL INSERT on ${records} records ran ${loops} times n/${loops}: `, sum / arr.length, " ms.")
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
            await dropMysqlTable(connection)
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
        console.log("Preparing data file... ")
        const startTime = new Date();
        const data = await importCsvFile()
        const endTime = new Date();
        let elapsedTime = endTime - startTime
        console.log("Loading complete, time: ", elapsedTime)
        // let jsonArray = ObjToArray(data)

        await runMySqlInsertTest(loops, data, records10k, connection)
        // await runMySqlInsertTest(loops, jsonArray, records100k, connection)
        // await runMySqlInsertTest(loops, jsonArray, records200k, connection)
        // await runMySqlInsertTest(loops, jsonArray, records500k, connection)
        // await runMySqlInsertTest(loops, jsonArray, records1m, connection)

        const endTimeTotal = new Date();
        let elapsedTimeTotal = endTimeTotal - startTimeTotal
        console.log("Total execution time: ", elapsedTimeTotal)

}