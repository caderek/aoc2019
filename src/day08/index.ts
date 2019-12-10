import arr from "@arrows/array"
import { readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput.split("").map(Number)

const input = prepareInput(readInput())

const goA = (input: number[]) =>
  input
    .chain(arr.chunk_(25 * 6))
    .chain(arr.sortBy_.num((a: number[]) => a.filter((x) => x === 0).length))
    .chain(arr.first_)
    .join("")
    .chain((s) => s.match(/1/g).length * s.match(/2/g).length)

const goB = (input: number[]) =>
  input
    .chain(arr.chunk_(25 * 6))
    .reverse()
    .reduce(arr.zipWith_((a, b) => (b === 2 ? a : b)))
    .chain(arr.chunk_(25))
    .map(arr.join(" "))
    .join("\n")
    .replace(/0/g, " ")
    .replace(/1/g, "#")

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA) // -> 2250
console.log("Solution to part 2:")
console.log(resultB)

/* ->

# # # #   #     #       # #   #     #   #        
#         #     #         #   #     #   #        
# # #     # # # #         #   #     #   #        
#         #     #         #   #     #   #        
#         #     #   #     #   #     #   #        
#         #     #     # #       # #     # # # # 

*/
