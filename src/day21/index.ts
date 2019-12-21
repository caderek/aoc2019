import { readInput, arr } from "../utils/index"
import compute from "./computer"

const toASCII = (instructions: string) =>
  instructions
    .trim()
    .split("\n")
    .map((instruction) =>
      instruction
        .replace(/ \/\/.*/, "")
        .trim()
        .split("")
        .concat("\n")
        .map((char) => char.charCodeAt(0)),
    )
    .flat()

const goA = async (source: string) => {
  const program = `
    NOT C J
    OR D T
    AND T J
    NOT A T
    OR T J
    WALK
  `

  const output = await compute(source, toASCII(program))

  // console.log(String.fromCharCode(...arr.butLast_(output)))

  return arr.last_(output)
}

const goB = async (source: string) => {
  const program = `
    NOT C T
    NOT A J
    AND H T
    OR T J
    NOT B T
    AND C T
    AND A T
    OR T J
    AND D J
    RUN
  `

  const output = await compute(source, toASCII(program))

  // console.log(String.fromCharCode(...arr.butLast_(output)))

  return arr.last_(output)
}

const main = async () => {
  /* Results */

  const input = readInput()

  console.time("Time")
  const resultA = await goA(input)
  const resultB = await goB(input)
  console.timeEnd("Time")

  console.log("Solution to part 1:", resultA) // -> 19352720
  console.log("Solution to part 2:", resultB) // -> 1143652885
}

main()
