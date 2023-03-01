import mysql from "mysql2";
import {displayLogs} from "../settings.js";

export async function startMySqlConnection() {
    const connection = await mysql.createPool({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.MYSQL_DATABASE // add local db in the project later if possible
    });

    connection.getConnection((error) => {
        if (error) {
            throw error;
        }
        if (displayLogs) {
            console.log('Connection established successfully');
        }
    });
    return connection
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

