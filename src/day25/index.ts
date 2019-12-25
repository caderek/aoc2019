import { readInput } from "../utils/index"
import compute, { unblock } from "./computer"

const solve = async (source: string) => {
  const commands = [
    "west",
    "take hypercube",
    "west",
    "take space law space brochure",
    "west",
    "north",
    "take shell",
    "west",
    "take mug",
    "south",
    "take festive hat",
    "north",
    "east",
    "south",
    "east",
    "east",
    "east",
    "south",
    "east",
    "take boulder",
    "west",
    "north",
    "east",
    "north",
    "west",
    "north",
    "take whirled peas",
    "west",
    "west",
    "take astronaut ice cream",
    "south",
    "inv",
    "drop boulder",
    "drop space law space brochure",
    "drop mug",
    "drop whirled peas",
    "south", // pressure-sensitive floor
  ]

  const inputs = []
  const outputs = []
  let done = false

  compute(source, inputs, outputs).then(() => (done = true))

  while (!done) {
    if (outputs.length === 0) {
      await unblock()
    }

    const out = []
    while (outputs.length !== 0) {
      out.push(outputs.shift())
    }

    const feedback = String.fromCharCode(...out)

    // console.log(feedback)
    // console.log("---------------------------------")

    if (feedback.includes("Oh, hello!")) {
      return feedback.match(/\d+/)[0]
    }

    ;`${commands.shift()}\n`
      .split("")
      .forEach((x) => inputs.push(x.charCodeAt(0)))
  }
}

const main = async () => {
  /* Results */

  const input = readInput()

  console.time("Time")
  const password = await solve(input)
  console.timeEnd("Time")

  console.log("Password:", password) // -> 33624080
}

main()
