const { spawn, spawnSync } = require("child_process")
const { readdirSync } = require("fs")
const { cp } = require("shelljs")

const day = process.argv[2]
const days = readdirSync("./src").filter(
  (folder) => !["template", "utils"].includes(folder),
)

if (!days.includes(day) && day) {
  console.log(`Creating file structure for ${day}...`)
  cp("-r", "src/template", `src/${day}`)
}

if (!day) {
  days.forEach((day) => {
    spawnSync("ts-node", [`src/${day}/index.ts`], {
      stdio: "inherit",
    })
  })
} else {
  spawn("nodemon", ["-x", "ts-node", `src/${day}/index.ts`], {
    stdio: "inherit",
  })
}
