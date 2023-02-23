import mysql from "mysql"
let loops = 1

let getMySql10kRows = []
let getMySql100kRows = []
let getMySql200kRows = []
let getMySql500kRows = []
let getMySql1mRows = []
let records10k = 10000
let records100k = 100000
let records200k = 200000
let records500k = 500000
let records1m = 1000000

async function startMySqlConnection(){
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

async function closeMySqlConnection(connection){
    connection.end((err) => {
    if (err) {
        console.error('Error disconnecting from database: ', err.stack);
        return;
    }
    console.log('Disconnected from database.');
});
}

async function getMySqlRecordsMs(limit, connection){
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

async function displayMySqlResult(records, arr, loops){
    let sum = 0
    arr.forEach((e)=>{
        sum += e;
    })
    console.log(`"Average ms for ${records} records ran ${loops} times: `, sum / arr.length)
}


async function runMySqlTest(){
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

    await runOneMySqlInstance(records10k, getMySql10kRows)
    await runOneMySqlInstance(records100k, getMySql100kRows)
    await runOneMySqlInstance(records200k, getMySql200kRows)
    await runOneMySqlInstance(records500k, getMySql500kRows)
    await runOneMySqlInstance(records1m, getMySql1mRows)
}

async function runOneMySqlInstance(records, arr){
    const connection = await startMySqlConnection()
    let result = await getMySqlRecordsMs(records, connection)
    arr.push(result)
    await closeMySqlConnection(connection);
}

async function loopMySqlTest(){
    for (let i = 0; i < loops; i++) {
        await runMySqlTest();
    }
    await displayMySqlResult(records10k, getMySql10kRows, loops)
    await displayMySqlResult(records100k, getMySql100kRows, loops)
    await displayMySqlResult(records200k, getMySql200kRows, loops)
    await displayMySqlResult(records500k, getMySql500kRows, loops)
    await displayMySqlResult(records1m, getMySql1mRows, loops)
}

await loopMySqlTest();