import concurrently from "concurrently";

const repeatN = 100

const commands = []

for (let i = 0; i <repeatN; i++) {
    commands.push({
        command: "npm run start"
    })
}

concurrently(commands)