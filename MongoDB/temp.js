const {MongoClient} = require('mongodb');
const dbName = 'examgroup'
const collectionName = 'animals'
const uri = "mongodb://127.0.0.1";
const client = new MongoClient(uri);

// async function main() {
//     try {
//         await client.connect();
//         await listDatabases(client);
//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }
// }
//
// main().catch(console.error);
//
// async function listDatabases(client){
//     const databasesList = await client.db().admin().listDatabases();
//
//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };


// app.get('/insert', async (req, res) => {
//     // client = await MongoClient.connect(url, { useNewUrlParser: true });
//     await client.connect();
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);
//     const startTime = new Date().getTime();
//     await collection.insertOne({ data: 'test' });
//     const endTime = new Date().getTime();
//     client.close();
//     res.send(`Time taken: ${endTime - startTime}ms`);
// });
//
// app.get('/get', async (req, res) => {
//     // const client = await MongoClient.connect(url, { useNewUrlParser: true });
//     await client.connect();
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);
//     const startTime = new Date().getTime();
//     let data = await collection.find().toArray();
//     // await collection.find();
//     const endTime = new Date().getTime();
//     client.close();
//     console.log({ message: `Time taken: ${endTime - startTime}ms`, result: data.length});
//     res.json({ message: `Time taken: ${endTime - startTime}ms`, result: data});
// });
