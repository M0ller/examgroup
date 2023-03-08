import {MongoClient} from "mongodb";
import {displayLogs} from "../settings.js";

const uri = "mongodb://127.0.0.1";

let client;

class MongoDBSingleton {
    constructor() {
        if (!client) {
            console.log("Created a new Instance!")
            client = new MongoClient(uri);
        } else {
            console.log("Instance already exists!")
        }
    }

    async connect() {
        try {
            await client.connect()
            if (displayLogs) {
                console.log("Connection established successfully")
            }
        } catch (e) {
            console.log(e)
        }
    }

    async close() {
        try {
            await client.close()
            if (displayLogs) {
                console.log('Disconnected from database.');
            }
        } catch (e) {
            console.log(e)
        }
    }

    getMongoClient() {
        return client
    }
}

export const mongoClient = new MongoDBSingleton()
