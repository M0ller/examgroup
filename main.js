import {loopMySqlGetTest} from "./mysql/mysql-get.js";
import {loopMongoGetTest} from "./mongodb/mongodb-get.js";
import {
    insertMySqlRecordsMs,
    loopMySqlInsertTest
} from "./mysql/mysql-insert.js";
import {startMySqlConnection} from "./mysql/mysql-server.js";

// await loopMySqlGetTest()
console.log("**************************************************************")
// await loopMongoGetTest()
console.log("**************************************************************")
await loopMySqlInsertTest()
console.log("**************************************************************")
