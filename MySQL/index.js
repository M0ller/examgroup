import mysql from "mysql"
let loops = 1

let get10kRows = []
let get100kRows = []
let get200kRows = []
let get500kRows = []
let get1mRows = []
let records10k = 10000
let records100k = 100000
let records200k = 200000
let records500k = 500000
let records1m = 1000000

async function startConnection(){
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'kamomillaStad1!',
        database: 'examgroup'
        // database: 'mondial'  // add local db in project later if possible
    });

    connection.connect((error) => {
        if(error){
            console.log('Error connecting to the MySQL Database');
            return;
        }
        console.log('Connection established successfully');
    });
    return connection
}

async function closeDB(connection){
    connection.end((err) => {
    if (err) {
        console.error('Error disconnecting from database: ', err.stack);
        return;
    }
    console.log('Disconnected from database.');
});
}

async function getRecordsMs(limit, connection){
    return new Promise((resolve, reject)=>{
        let elapsedTime
        const dbName = "user"
        const startTime = new Date();

        const query = `SELECT * FROM ${dbName} LIMIT ${limit}`;
        connection.query(query, async (error, results, fields) => {
            if (error) {
                console.log(error);
                reject(error)
            }else{
                const endTime = new Date();
                elapsedTime = endTime - startTime;
                console.log(`Query: "SELECT * FROM ${dbName} LIMIT ${limit}". Got ${results.length} rows in ${elapsedTime} ms`);
                // get10kRows.push(elapsedTime)
                resolve(elapsedTime)
            }
        });
    });
}

async function displayResult(records, arr, loops){
    let sum = 0
    arr.forEach((e)=>{
        sum += e;
    })
    console.log(`"Average ms for ${records} records ran ${loops} times: `, sum / arr.length)
}


async function runTest(){
    // const connection = await startConnection()
    //
    // // run 10k records
    // let result10k = await getRecordsMs(records10k, connection)
    // get10kRows.push(result10k)
    //
    // // run 100k records
    // let result100k = await getRecordsMs(records100k, connection)
    // get100kRows.push(result100k)
    //
    // // run 200k records
    // let result200k = await getRecordsMs(records200k, connection)
    // get200kRows.push(result200k)
    //
    // // run 500k records
    // let result500k = await getRecordsMs(records500k, connection)
    // get500kRows.push(result500k)
    //
    // // run 1m records
    // let result1m = await getRecordsMs(records1m, connection)
    // get1mRows.push(result1m)
    // await closeDB(connection);

    await runOne(records10k, get10kRows)
    await runOne(records100k, get100kRows)
    await runOne(records200k, get200kRows)
    await runOne(records500k, get500kRows)
    await runOne(records1m, get1mRows)
}

async function runOne(records, arr){
    const connection = await startConnection()
    let result = await getRecordsMs(records, connection)
    arr.push(result)
    await closeDB(connection);
}

async function loopTest(){
    for (let i = 0; i < loops; i++) {
        await runTest();
    }
    await displayResult(records10k, get10kRows, loops)
    await displayResult(records100k, get100kRows, loops)
    await displayResult(records200k, get200kRows, loops)
    await displayResult(records500k, get500kRows, loops)
    await displayResult(records1m, get1mRows, loops)
}

await loopTest();