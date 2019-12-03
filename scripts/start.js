const { spawn, spawnSync } = require("child_process")
const { readdirSync } = require("fs")
const { cp } = require("shelljs")

const day = process.argv[2]
const days = readdirSync("./src")

if (!days.includes(day) && day !== "all") {
  console.log(`Creating file structure for ${day}...`)
  cp("-r", "src/template", `src/${day}`)
}

if (day === "all") {
  days
    .filter((folder) => !["template, utils"].includes(folder))
    .forEach((day) => {
      spawnSync("ts-node", [`src/${day}/index.ts`], {
        stdio: "inherit",
      })
    })
} else {
  spawn("nodemon", ["-x", "ts-node", `src/${day}/index.ts`], {
    stdio: "inherit",
  })
}
