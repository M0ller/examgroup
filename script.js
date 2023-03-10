import concurrently from "concurrently";
import {scriptRepeatN} from "./settings.js";

const commands = []

for (let i = 0; i <scriptRepeatN; i++) {
    commands.push({
        command: "npm run start"
    })
}

concurrently(commands)