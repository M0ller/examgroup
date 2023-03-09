import {loopMySqlInsertTest} from "./mysql/mysql-insert.js";
import {loopMongodbInsertTest} from "./mongodb/mongodb-insert.js";
import {loopMySqlGetTest} from "./mysql/mysql-get.js";
import {loopMongoGetTest} from "./mongodb/mongodb-get.js";
import {getInstance} from "./mysql/mysql-server.js";

// Singleton for MySQL
const connection = getInstance()

// console.log("**************************************************************")
// console.log("MySQL SELECT test:")
await loopMySqlGetTest(connection)
// console.log("**************************************************************")
// console.log("MongoDB SELECT test:")
// await loopMongoGetTest()
// console.log("**************************************************************")
// console.log("MySQL INSERT test:")
// await loopMySqlInsertTest(connection)
// console.log("**************************************************************")
// console.log("MongoDB INSERT test:")
// await loopMongodbInsertTest()
// console.log("**************************************************************")