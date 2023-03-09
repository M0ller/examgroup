import concurrently from "concurrently";

const repeatN = 1000

const commands = []

for (let i = 0; i <repeatN; i++) {
    commands.push({
        command: "npm run start"
    })
}

concurrently(commands)