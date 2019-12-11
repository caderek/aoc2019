import * as R from "ramda"
import * as iter from "iter-tools"
import { arr, com, dis, mul } from "@arrows/arrows"
import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const goA = (rawInput: string) => {
  const input = prepareInput(rawInput)

  return
}

const goB = (rawInput: string) => {
  const input = prepareInput(rawInput)

  return
}

/* Tests */

// test(goA(""), )
// test(goA(""), )

// test(goB(""), )
// test(goB(""), )

/* Results */

const input = readInput()

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
