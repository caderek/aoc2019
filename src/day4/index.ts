import { test } from "../utils/index"
import { range_ } from "@arrows/array"

const input = range_(359282, 820401).map(String)

const isAscending = (str: string) => str.match(/^0*1*2*3*4*5*6*7*8*9*$/)

const goA = (input: string[]) =>
  input.filter((pass) => pass.match(/(.)\1/) && isAscending(pass)).length

const goB = (input: string[]) =>
  input.filter(
    (pass) =>
      (pass.match(/(.)\1+/g) || []).some((x) => x.length === 2) &&
      isAscending(pass),
  ).length

/* Tests */

test(goA(["111111"]), 1)
test(goA(["123012"]), 0)
test(goA(["123456"]), 0)
test(goA(["123456", "111111", "123345"]), 2)

test(goB(["111111"]), 0)
test(goB(["123012"]), 0)
test(goB(["123466"]), 1)
test(goB(["111166"]), 1)
test(goB(["222446", "111111", "123345"]), 2)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA) // -> 511
console.log("Solution to part 2:", resultB) // -> 316
