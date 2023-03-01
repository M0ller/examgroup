import {displayLogs} from "../settings.js";

export async function closeMySqlConnection(connection) {
    await connection.end((err) => {
        if (err) {
            console.error('Error disconnecting from database: ', err.stack);
            return;
        }
        if (displayLogs) {
            console.log('Disconnected from database.');
        }
    });
}

/////////// Singleton

// class MysqlSingleton {
//     constructor() {
//         if (MysqlSingleton.instance) {
//             return MysqlSingleton.instance;
//         }
//
//         // console.log("Host: ", process.env.HOST)
//         // console.log("USER: ", process.env.USER)
//         // console.log("PASSWORD: ", process.env.PASSWORD)
//         // console.log("MYSQL_DATABASE: ", process.env.MYSQL_DATABASE)
//         this.connection = mysql.createConnection({
//             host: process.env.HOST,
//             user: process.env.USER,
//             password: process.env.PASSWORD,
//             database: process.env.MYSQL_DATABASE
//         })
//         MysqlSingleton.instance = this
//     }
//
//
//     connect() {
//         return new Promise((resolve, reject) => {
//             this.connection.connect((err) => {
//                 if (err) {
//                     reject(err);
//                     throw err;
//                 }
//                 if (displayLogs) {
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
//                 if (err) {
//                     reject(err);
//                     throw err;
//                 }
//                 resolve(rows);
//             });
//         });
//     }
//
//     close() {
//         return new Promise((resolve, reject) => {
//             this.connection.end(err => {
//                 if (err) {
//                     reject(err);
//                     throw err;
//                 }
//                 if (displayLogs) {
//                     console.log('Disconnected from database.');
//                 }
//                 resolve();
//             });
//         });
//     }
// }
//
// export const mysqlClient = new MysqlSingleton();


// let instance
// class Database {
//     constructor() {
//         if (!instance) {
//             instance = mysql.createPool({
//             host: process.env.HOST,
//             user: process.env.USER,
//             password: process.env.PASSWORD,
//             database: process.env.MYSQL_DATABASE
//         });
//         return instance
//         }
//     }
//
//     async connect() {
//         return new Promise((resolve, reject) => {
//             instance.pool.getConnection((err) => {
//                 if (err) {
//                     console.log("error")
//                     return reject(err);
//                 }
//                 console.log("connected!")
//                 resolve();
//             });
//         });
//     }
//
//     getInstance(){
//         return instance
//     }
//
//     // query(queryString, params) {
//     //     return new Promise((resolve, reject) => {
//     //         client.pool.query(queryString, params, (err, result) => {
//     //             if (err) {
//     //                 return reject(err);
//     //             }
//     //             resolve(result);
//     //         });
//     //     });
//     // }
//     //
//     // close() {
//     //     return new Promise((resolve, reject) => {
//     //         client.pool.end((err) => {
//     //             if (err) {
//     //                 return reject(err);
//     //             }
//     //             resolve();
//     //         });
//     //     });
//     // }
// }
// export const db = new Database();


///////////////////////////////////////////////////


// function singleton
// let client
// export const getInstance = () => {
//     if (client) {
//         return client;
//     }
//     client = mysql.createPool({
//         host: process.env.HOST,
//         user: process.env.USER,
//         password: process.env.PASSWORD,
//         database: process.env.MYSQL_DATABASE
//     });
//     return client
//
//     // connect() {
//     //     return new Promise((resolve, reject) => {
//     //         this.connection.connect((err) => {
//     //             if (err) {
//     //                 reject(err);
//     //                 throw err;
//     //             }
//     //             if (displayLogs) {
//     //                 console.log('Connection established successfully');
//     //             }
//     //             resolve();
//     //         });
//     //     });
//     // }
// }

//////////////////////////////////////////////
// let client
// class Database {
//     constructor() {
//         if(client){
//             return client;
//         }
//         client = mysql.createPool({
//         host: process.env.HOST,
//         user: process.env.USER,
//         password: process.env.PASSWORD,
//         database: process.env.MYSQL_DATABASE
//     });
//         return client
//     }
//
//     getInstance(){
//         return client
//     }
//
//     hello() {
//         console.log("I am in hello")
//         // return new Promise((resolve, reject) => {
//             client.getConnection((err) => {
//                 if (err) {
//                     // reject(err);
//                     throw err;
//                 }
//                 if (displayLogs) {
//                     console.log('Connection established successfully');
//                 }
//                 // resolve();
//             });
//         // });
//     }
//
// }
// export const db = new Database();


//////////////////////////////////////////////


// export const db = () => {
//     let instance
//
//     instance = new mysql.createPool({
//         host: process.env.HOST,
//         user: process.env.USER,
//         password: process.env.PASSWORD,
//         database: process.env.MYSQL_DATABASE
//     });
//     return instance;
//
//     return {
//         getInstance: function () {
//             if (!instance) {
//                 instance = createInstance()
//                 return instance
//             }
//         },
//         connect: function (){
//             instance.getConnection((err) => {
//                 if (err) {
//                     // reject(err);
//                     throw err;
//                 }
//                 if (displayLogs) {
//                     console.log('Connection established successfully');
//                 }
//                 // resolve();
//             });
//         }
//     }
// }


////////////////////////////////////////

// export let singleton = (function () {
//     let instance
//
//     function createInstance() {
//         let object = new Object("I am the instance");
//         return object
//     }
//
//     return {
//         getInstance: function () {
//             if (!instance) {
//                 instance = createInstance()
//                 return instance
//             }
//         },
//         hello: function (){
//             console.log("hello")
//         }
//     };
// })();

