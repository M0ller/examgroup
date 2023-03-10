import concurrently from "concurrently";
import {scriptReapetN} from "./settings.js";

const commands = []

for (let i = 0; i <scriptReapetN; i++) {
    commands.push({
        command: "npm run start"
    })
}

concurrently(commands)