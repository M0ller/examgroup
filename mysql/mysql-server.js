import mysql from "mysql";
import {displayLogs} from "../settings.js";

export async function startMySqlConnection(){
    const connection = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.MYSQL_DATABASE
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

export async function closeMySqlConnection(connection){
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