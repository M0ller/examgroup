
import {loopMongodbInsertTest} from "./mongodb/mongodb-insert.js";
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
await loopMongodbInsertTest()
console.log("**************************************************************")
