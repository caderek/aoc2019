import { readInput } from "../utils/index"
import compute from "./computer"

const goA = async (source: string) => {
  const points = []
  const size = 50

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      points.push([x, y])
    }
  }

  const outputs = await Promise.all(
    points.map((point) => compute(source, point)),
  )

  return outputs.flat().filter((x) => x === 1).length
}

const goB = async (source: string) => {
  const target = 100

  for (let y = 500; y < 1500; y++) {
    for (let x = 500; x < 1500; x++) {
      const [a] = await compute(source, [x, y])
      if (a === 0) {
        continue
      }
      const [b] = await compute(source, [x + target - 1, y])
      if (b === 0) {
        continue
      }
      const [c] = await compute(source, [x, y + target - 1])
      if (c === 0) {
        continue
      }

      return x * 10000 + y
    }
  }
}

const main = async () => {
  /* Results */

  const input = readInput()

  console.time("Time")
  const resultA = await goA(input)
  const resultB = await goB(input)
  console.timeEnd("Time")

  console.log("Solution to part 1:", resultA) // -> 220
  console.log("Solution to part 2:", resultB) // -> 10010825
}

main()
