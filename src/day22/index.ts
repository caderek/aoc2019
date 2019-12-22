import { readInput, arr } from "../utils/index"
import { modInv, modPow } from "bigint-crypto-utils"

const prepareInput = (rawInput: string, parse: Function) =>
  rawInput.split("\n").map((x) => {
    if (x.startsWith("deal with")) {
      return { type: "inc", val: parse(x.split("deal with increment ")[1]) }
    }
    if (x.startsWith("deal into")) {
      return { type: "rev" }
    }
    if (x.startsWith("cut")) {
      return { type: "cut", val: parse(x.split("cut")[1]) }
    }
  })

const goA = (rawInput: string) => {
  const moves = prepareInput(rawInput, Number)
  const cards = 10007

  let deck = arr.range_(0, cards)

  moves.forEach(({ type, val }) => {
    switch (type) {
      case "rev": {
        deck.reverse()
        break
      }
      case "cut": {
        const a = deck.slice(val)
        const b = deck.slice(0, val)
        break
      }
      case "inc": {
        const temp = arr.range_(0, cards).fill(null)
        let originalIndex = 0
        let index = 0

        while (originalIndex < cards) {
          if (temp[index % cards] === null) {
            temp[index % cards] = deck[originalIndex]
            originalIndex++
          }

          index += val
        }

        deck = temp
        break
      }
    }
  })

  return deck.findIndex((x) => x === 2019)
}

const goB = (rawInput: string) => {
  const moves = prepareInput(rawInput, BigInt)
  const repeats = 101741582076661n
  const cards = 119315717514047n
  const card = 2020n

  let incMul = 1n
  let offsetDiff = 0n

  moves.forEach(({ type, val }) => {
    switch (type) {
      case "rev": {
        incMul *= -1n
        incMul = incMul % cards
        offsetDiff += incMul
        offsetDiff = offsetDiff % cards
        break
      }
      case "cut": {
        offsetDiff += val * incMul
        offsetDiff = offsetDiff % cards
        break
      }
      case "inc": {
        incMul *= modInv(val, cards)
        incMul = incMul % cards
        break
      }
    }
  })

  const inc: bigint = modPow(incMul, repeats, cards)

  let offset =
    (offsetDiff * (1n - inc) * modInv((1n - incMul) % cards, cards)) % cards

  return Number((offset + inc * card) % cards)
}

/* Results */

const input = readInput()

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA) // -> 3074
console.log("Solution to part 2:", resultB) // -> 104073967000066
