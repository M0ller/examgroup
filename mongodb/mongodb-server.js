import {MongoClient} from "mongodb";
const uri = "mongodb://127.0.0.1";
export async function startMongoConnection(){
    const connection = new MongoClient(uri);

    try {
        await connection.connect();
    }catch (e){
        console.log(e)
    }
    return connection
}

export async function closeMongoConnection(connection){
    await connection.close();
}