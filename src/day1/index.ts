import * as fs from "fs"
import {
  calculateFuelMass,
  calculateCorrectFuelMass,
  calculateTotalFuelMass,
} from "./solution"

const input = fs
  .readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n")
  .map(Number)

console.log(calculateTotalFuelMass(input, calculateFuelMass))
console.log(calculateTotalFuelMass(input, calculateCorrectFuelMass))
