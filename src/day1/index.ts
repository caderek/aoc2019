import { test, readInput } from "../utils"

const rawInput = readInput()
const input = rawInput.split("\n").map(Number)

type Calc = (num: number) => number

const calculateFuelMass: Calc = (moduleWeight) => {
  return Math.floor(moduleWeight / 3) - 2
}

const calculateCorrectFuelMass: Calc = (moduleWeight) => {
  const mass = calculateFuelMass(moduleWeight)
  return mass > 0 ? mass + calculateCorrectFuelMass(mass) : 0
}

const calculateTotalFuelMass = (input: number[], calculate: Calc) => {
  return input.reduce((a, b) => a + calculate(b), 0)
}

/* Tests */

test(calculateFuelMass(12), 2)
test(calculateFuelMass(14), 2)
test(calculateFuelMass(1969), 654)
test(calculateFuelMass(100756), 33583)

test(calculateCorrectFuelMass(14), 2)
test(calculateCorrectFuelMass(1969), 966)
test(calculateCorrectFuelMass(100756), 50346)

test(
  calculateTotalFuelMass([12, 14, 1969, 100756], calculateFuelMass),
  2 + 2 + 654 + 33583,
)

test(
  calculateTotalFuelMass([14, 1969, 100756], calculateCorrectFuelMass),
  2 + 966 + 50346,
)

/* Results */

console.time("Time")
const resultA = calculateTotalFuelMass(input, calculateFuelMass)
const resultB = calculateTotalFuelMass(input, calculateCorrectFuelMass)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
