import { test, readInput } from "../utils/index"
import { last_ } from "@arrows/array"
import compute from "./computer"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const arePhasesUnique = (phases: number[]) =>
  new Set(phases).size === phases.length

function* generatePhaseSequences(from: number, to: number) {
  for (let i = from; i < to; i++) {
    for (let j = from; j < to; j++) {
      for (let k = from; k < to; k++) {
        for (let l = from; l < to; l++) {
          for (let m = from; m < to; m++) {
            const phases = [i, j, k, l, m]
            if (arePhasesUnique(phases)) {
              yield phases
            }
          }
        }
      }
    }
  }
}

const goA = async (source: string) => {
  const phaseSequences = generatePhaseSequences(0, 5)
  const outputs: number[] = []

  for (const [a, b, c, d, e] of phaseSequences) {
    const out1 = []
    const out2 = []
    const out3 = []
    const out4 = []
    const out5 = []

    await Promise.all([
      compute(source, [a], [0], out1),
      compute(source, [b], out1, out2),
      compute(source, [c], out2, out3),
      compute(source, [d], out3, out4),
      compute(source, [e], out4, out5),
    ])

    outputs.push(last_(out5))
  }

  return Math.max(...outputs)
}

const goB = async (source: string) => {
  const phaseSequences = generatePhaseSequences(5, 10)
  const outputs: number[] = []

  for (const [a, b, c, d, e] of phaseSequences) {
    const out1 = []
    const out2 = []
    const out3 = []
    const out4 = []
    const out5 = [0]

    await Promise.all([
      compute(source, [a], out5, out1),
      compute(source, [b], out1, out2),
      compute(source, [c], out2, out3),
      compute(source, [d], out3, out4),
      compute(source, [e], out4, out5),
    ])

    outputs.push(last_(out5))
  }

  return Math.max(...outputs)
}

/* Tests */

// goA("3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0").then(test(43210))

// goA(
//   "3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0",
// ).then(test(54321))

// goA(
//   "3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0",
// ).then(test(65210))

// goB(
//   "3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5",
// ).then(test(139629729))

// goB(
//   "3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10",
// ).then(test(18216))

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
