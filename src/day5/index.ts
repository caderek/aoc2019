import { test, readInput } from "../utils/index"
import { pipe } from "@arrows/composition"
import {} from "@arrows/array"
import { multi, method } from "@arrows/multimethod"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const goA = (input) => {
  return
}

const goB = (input) => {
  return
}

/* Tests */

// test()

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
