import mysql from "mysql2";
import {displayLogs} from "../settings.js";
import * as dotenv from "dotenv";

dotenv.config()


// class MysqlConnection{
//     constructor() {
//         this.connection = mysql.createConnection({
//         host: process.env.HOST,
//         user: process.env.USER,
//         password: process.env.PASSWORD,
//         database: process.env.MYSQL_DATABASE
//         // database: process.env.DATABASE  // add local db in project later if possible
//     });
//     }
//
//     open(){
//         return new Promise((resolve, reject) => {
//             this.connection.connect(err => {
//                 if (err) return reject(err);
//                 if (displayLogs){
//                     console.log('Connection established successfully');
//                 }
//                 resolve();
//             });
//         });
//     }
//
//     query(sql, args) {
//         return new Promise((resolve, reject) => {
//             this.connection.query(sql, args, (err, rows) => {
//                 if (err) return reject(err);
//                 resolve(rows);
//             });
//         });
//     }
//
//     close() {
//         return new Promise((resolve, reject) => {
//             this.connection.end(err => {
//                 if (err) return reject(err);
//                 if (displayLogs){
//                     console.log('Disconnected from database.');
//                 }
//                 resolve();
//             });
//         });
//     }
// }
//
// export const connection = new MysqlConnection();


export async function createMySqlConnection(){
    return mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.MYSQL_DATABASE
        // database: process.env.DATABASE  // add local db in project later if possible
    });
}

export function startMySqlConnection(connection){
    return new Promise((resolve, reject) => {
    // const connection = mysql.createConnection({
    //     host: process.env.HOST,
    //     user: process.env.USER,
    //     password: process.env.PASSWORD,
    //     database: process.env.MYSQL_DATABASE
    //     // database: process.env.DATABASE  // add local db in project later if possible
    // });

    connection.connect((error) => {
        if(error){
            reject()
            throw error;
        }
        if (displayLogs){
            console.log('Connection established successfully');
        }
    });
    resolve(connection)
    // return connection
    });
}


export function closeMySqlConnection(connection){
    return new Promise((resolve, reject) => {
    connection.end((err) => {
        if (err) {
            console.error('Error disconnecting from database: ', err.stack);
            reject()
        }
        if (displayLogs){
            console.log('Disconnected from database.');
        }
    });
        resolve()
    });
}