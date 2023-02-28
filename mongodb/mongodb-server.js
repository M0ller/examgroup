import {MongoClient} from "mongodb";

const uri = "mongodb://127.0.0.1";

export async function startMongoConnection() {
    const connection = new MongoClient(uri);

    try {
        await connection.connect()

        console.log("Connection established successfully")
    } catch (e) {
        console.log(e)
    }
    return connection
}

export async function closeMongoConnection(connection) {
    try {
        await connection.close();
        console.log("Disconnected from database.")
    } catch (e) {
        console.log(e)
    }
}

////////// Singleton? ////////////

let client;

class MongoDBSingleton {
    constructor() {
        if(!client){
            client = new MongoClient(uri);
        }
    }

    async connect() {
        try {
            await client.connect()
            console.log("Connection established successfully")
        }catch (e) {
            console.log(e)
        }
    }

    async close() {
        try {
            await client.close()
        }catch (e) {
            console.log(e)
        }
    }

    getMongoClient(){
        return client
    }

}

export const mongoClient = new MongoDBSingleton()