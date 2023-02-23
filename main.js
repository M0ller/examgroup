import {loopMySqlTest} from "./mysql_methods.js";
import {loopMongoTest} from "./mongodb_methods.js";
import * as dotenv from 'dotenv'
dotenv.config()

await loopMySqlTest()
// await loopMongoTest()


