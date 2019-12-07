import { test, readInput } from "../utils/index"
import { last_ } from "@arrows/array"
import compute from "./computer"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const arePhasesUnique = (phases) => new Set(phases).size === phases.length

const goA = async (source) => {
  const outputs = []
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      for (let k = 0; k < 5; k++) {
        for (let l = 0; l < 5; l++) {
          for (let m = 0; m < 5; m++) {
            if (arePhasesUnique([i, j, k, l, m])) {
              const out1 = []
              const out2 = []
              const out3 = []
              const out4 = []
              const out5 = []

              await Promise.all([
                compute(source, [i], [0], out1),
                compute(source, [j], out1, out2),
                compute(source, [k], out2, out3),
                compute(source, [l], out3, out4),
                compute(source, [m], out4, out5),
              ])

              outputs.push(last_(out5))
            }
          }
        }
      }
    }
  }

  return Math.max(...outputs)
}

const goB = async (source) => {
  const outputs = []
  for (let i = 5; i < 10; i++) {
    for (let j = 5; j < 10; j++) {
      for (let k = 5; k < 10; k++) {
        for (let l = 5; l < 10; l++) {
          for (let m = 5; m < 10; m++) {
            if ([...new Set([i, j, k, l, m])].length === 5) {
              const out1 = []
              const out2 = []
              const out3 = []
              const out4 = []
              const out5 = [0]

              await Promise.all([
                compute(source, [i], out5, out1),
                compute(source, [j], out1, out2),
                compute(source, [k], out2, out3),
                compute(source, [l], out3, out4),
                compute(source, [m], out4, out5),
              ])

              outputs.push(last_(out5))
            }
          }
        }
      }
    }
  }

  return Math.max(...outputs)
}

/* Tests */

goA("3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0").then(test(43210))

goA(
  "3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0",
).then(test(54321))

goA(
  "3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0",
).then(test(65210))

goB(
  "3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5",
).then(test(139629729))

goB(
  "3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10",
).then(test(18216))

/* Results */

const main = async () => {
  console.time("Time")
  const resultA = await goA(input)
  const resultB = await goB(input)
  console.timeEnd("Time")

  console.log("Solution to part 1:", resultA) // -> 255590
  console.log("Solution to part 2:", resultB) // -> 58285150
}

main()
