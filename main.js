import {loopMySqlGetTest} from "./mysql/mysql-get.js";
import {loopMongoGetTest} from "./mongodb/mongodb-get.js";
import {createMysqlTable, dropMysqlTable, importCsvFile, insertMySqlRecordsMs} from "./mysql/mysql-insert.js";
import {startMySqlConnection} from "./mysql/mysql-server.js";

// await loopMySqlGetTest()
console.log("**************************************************************")
// await loopMongoGetTest()

// await createMysqlTable()

// await dropMysqlTable()



await insertMySqlRecordsMs(10)