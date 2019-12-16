import { test, readInput, R } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput.split("").map(Number)

const basePattern = [0, 1, 0, -1]

const getMultiplier = (n: number, index: number) => {
  return basePattern[Math.floor(((index + 1) % (4 * n)) / n)]
}

const goA = (rawInput: string) => {
  let digits = prepareInput(rawInput)

  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < digits.length; j++) {
      let digit = 0

      for (let k = 0; k < digits.length; k++) {
        digit += digits[k] * getMultiplier(j + 1, k)
      }

      digits[j] = Math.abs(digit) % 10
    }
  }

  return digits.slice(0, 8).join("")
}

const goB = (rawInput: string) => {
  let base = prepareInput(rawInput)
  const baseOffset = Number(base.slice(0, 7).join(""))
  const times = Math.ceil((base.length * 10000 - baseOffset) / base.length)

  const digits = R.repeat(base, times)
    .flat()
    .slice(baseOffset % base.length)

  for (let i = 0; i < 100; i++) {
    for (let j = digits.length - 2; j >= 0; j--) {
      const digit = digits[j] + digits[j + 1]
      digits[j] = Math.abs(digit) % 10
    }
  }

  return digits.slice(0, 8).join("")
}

/* Tests */

test(goA("80871224585914546619083218645595"), "24176176")
test(goA("19617804207202209144916044189917"), "73745418")
test(goA("69317163492948606335995924319873"), "52432133")

test(goB("03036732577212944063491565474664"), "84462026")
test(goB("02935109699940807407585447034323"), "78725270")
test(goB("03081770884921959731165446850517"), "53553731")

/* Results */

const input = readInput()

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA) // -> 89576828
console.log("Solution to part 2:", resultB) // -> 23752579
