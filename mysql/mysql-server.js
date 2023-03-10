import * as dotenv from 'dotenv'
import mysql from "mysql2";
import {displayLogs} from "../settings.js";

dotenv.config()

let instance = null
function createInstance() {
    instance = mysql.createPool({
        connectionLimit: 10,
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.MYSQL_DATABASE
    })
    return instance;
}


export function getInstance(){
    if (!instance) {
        instance = createInstance()
        if (displayLogs) {
        console.log("created instance")
        }
    }else{
        if (displayLogs) {
            console.log("Still alive")
        }
    }
    return instance
}

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
