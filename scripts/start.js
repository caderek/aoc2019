const { execSync } = require("child_process")
const { readdirSync } = require("fs")

const day = process.argv[2]
const days = readdirSync("./src")

if (!days.includes(day)) {
  console.log(`No solution for ${day}`)
  process.exit(1)
}

const output = execSync(`ts-node src/${day}/index.ts`).toString()

console.log(`Solutions for ${day}:`)
console.log(output)
