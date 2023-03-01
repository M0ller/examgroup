import {loopMySqlInsertTest} from "./mysql/mysql-insert.js";
import {loopMongodbInsertTest} from "./mongodb/mongodb-insert.js";
import {getInstance} from './mysql/mysql-singleton.js'
import {loopMySqlGetTest} from "./mysql/mysql-get.js";
import {loopMongoGetTest} from "./mongodb/mongodb-get.js";
import {closeMySqlConnection} from "./mysql/mysql-server.js";

const connection = getInstance()
// console.log("**************************************************************")
// console.log("MySQL SELECT test:")
// //await loopMySqlGetTest()
// console.log("**************************************************************")
// console.log("MongoDB SELECT test:")
//await loopMongoGetTest()
console.log("**************************************************************")
console.log("MySQL INSERT test:")
await loopMySqlInsertTest(connection)

console.log("**************************************************************")
// console.log("MongoDB INSERT test:")
// // await loopMongodbInsertTest()
// console.log("**************************************************************")


// con.getConnection()
// const con = db().getInstance()
// con.getConnection((err) => {
//     if (err) {
//         throw err;
//     }
//     console.log("Connected!")
// })

// for (let i = 0; i < 5; i++) {
//     await create()
//     await drop()
//     console.log("iteration: ", i)
// }


// async function create() {
//     getInstance().getConnection((err, connection) => {
//         if (err) throw err;
//         const query = `CREATE TABLE IF NOT EXISTS test_table
//                    (
//                        id         int,
//                        puzzle     text,
//                        solution   double,
//                        clues      int,
//                        difficulty double
//                    );`
//         return new Promise((resolve, reject) => {
//             connection.query(query, function (err, rows) {
//                 if (err) {
//                     reject()
//                     throw err;
//                 } else {
//                 console.log("table created!: ")
//                 resolve()
//                 }
//             })
//         })
//     })
// }
// async function drop() {
//     getInstance().getConnection((err, connection) => {
//         if (err) throw err;
//         const query = `DROP TABLE IF EXISTS test_table;`
//         return new Promise((resolve, reject) => {
//             connection.query(query, function (err, rows) {
//                 if (err) {
//                     reject()
//                     throw err;
//                 }else {
//                 console.log("table dropped!: ")
//                 resolve()
//                 }
//             })
//         })
//     })
// }

// let myInstance = singleton
// console.log(myInstance.getInstance())
// myInstance.hello()

// console.log(myInstance)
