import {loopMySqlGetTest} from "./mysql/mysql-get.js";
import {loopMongoGetTest} from "./mongodb/mongodb-get.js";
import {
    loopMySqlInsertTest
} from "./mysql/mysql-insert.js";
import {startMySqlConnection} from "./mysql/mysql-server.js";
import {createMongodbCollection, dropMongodbCollection} from "./mongodb/mongodb-insert.js";
import {closeMongoConnection, startMongoConnection} from "./mongodb/mongodb-server.js";

console.log("**************************************************************")
console.log("MySQL SELECT test:")
// await loopMySqlGetTest()
console.log("**************************************************************")
console.log("MongoDB SELECT test:")
// await loopMongoGetTest()
console.log("**************************************************************")
console.log("MySQL INSERT test:")
// await loopMySqlInsertTest()
console.log("**************************************************************")
console.log("MongoDB INSERT test:")
await createMongodbCollection()
await dropMongodbCollection()
// await closeMongoConnection(con)
console.log("**************************************************************")
