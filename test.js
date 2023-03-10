import pm2 from 'pm2'
import {loopMongodbInsertTest} from "./mongodb/mongodb-insert.js";
import * as cluster from "cluster";

// pm2.connect((err) => {
//     if (err) {
//         console.error(err);
//         process.exit(1);
//     }
//
//     pm2.list((err, list) => {
//         if (err) {
//             console.error(err);
//             process.exit(1);
//         }
//
//         list.forEach((process) => {
//             pm2.trigger(process.pm_id, loopMongodbInsertTest() , (err, res) => {
//                 if (err) {
//                     console.error(err);
//                     process.exit(1);
//                 }
//
//                 console.log(res);
//             });
//         });
//     });
// });

function logMessage(){
    console.log("Hello from cluster")
}