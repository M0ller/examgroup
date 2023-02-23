import {loopMySqlTest} from "./mysql_methods.js";
import {loopMongoTest} from "./mongodb_methods.js";

// await loopMySqlTest()
// await loopMongoTest()

// const envVariables = process.env;

// const {HOST, USER, PASSWORD, DATABASE} = envVariables;

console.log(process.env.HOST)
console.log(process.env.USER)
console.log(process.env.PASSWORD)
console.log(process.env.DATABASE)

