import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput.split("").map(Number)

const input = prepareInput(readInput())

const goA = (input: number[]) => {
  const layers = []
  for (let i = 0; i < input.length; i = i + 25 * 6) {
    layers.push(input.slice(i, i + 25 * 6))
  }

  const maxZeros = layers.sort(
    (a, b) => a.filter((x) => x === 0).length - b.filter((x) => x === 0).length,
  )[0]

  return (
    maxZeros.filter((x) => x === 1).length *
    maxZeros.filter((x) => x === 2).length
  )
}

const goB = (input: number[]) => {
  const layers = []
  for (let i = 0; i < input.length; i = i + 25 * 6) {
    layers.push(input.slice(i, i + 25 * 6))
  }

  const fromBottom = layers.reverse()

  const image = Array.from({ length: 250 }).fill(" ")

  for (const layer of fromBottom) {
    for (let i = 0; i < layer.length; i++) {
      image[i] = layer[i] === 2 ? image[i] : layer[i]
    }
  }

  const xx = []
  for (let j = 0; j < image.length; j = j + 25) {
    xx.push(image.slice(j, j + 25))
  }

  return xx
    .map((z) => z.join(""))
    .join("\n")
    .replace(/0/g, " ")
}

/* Tests */

// test()

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:\n", resultA)
console.log("Solution to part 2:")
console.log(resultB)
