import { readInput } from "../utils/index"
import compute from "./computer"

const goA = async (source: string) => {
  const size = 50
  const outputs = []

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      outputs.push(await compute(source, [x, y]))
    }
  }

  return outputs.flat().filter((x) => x === 1).length
}

const goB = async (source: string) => {
  const size = 100
  const from = 500
  const to = 1500

  for (let y = from; y < to; y++) {
    for (let x = from; x < to; x++) {
      const [a] = await compute(source, [x, y])
      if (!a) continue

      const [b] = await compute(source, [x + size - 1, y])
      if (!b) continue

      const [c] = await compute(source, [x, y + size - 1])
      if (!c) continue

      return x * 10000 + y
    }
  }
}

const main = async () => {
  /* Results */

  const input = readInput()

  console.time("Time")
  const resultA = await goA(input)
  // const resultB = await goB(input)
  console.timeEnd("Time")

  console.log("Solution to part 1:", resultA) // -> 220
  // console.log("Solution to part 2:", resultB) // -> 10010825
}

main()
