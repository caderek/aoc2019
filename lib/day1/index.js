"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const rawInput = utils_1.readInput();
const input = rawInput.split("\n").map(Number);
const calculateFuelMass = (moduleWeight) => {
    return Math.floor(moduleWeight / 3) - 2;
};
const calculateCorrectFuelMass = (moduleWeight) => {
    const mass = calculateFuelMass(moduleWeight);
    return mass > 0 ? mass + calculateCorrectFuelMass(mass) : 0;
};
const calculateTotalFuelMass = (input, calculate) => {
    return input.reduce((a, b) => a + calculate(b), 0);
};
/* Tests */
utils_1.test(calculateFuelMass(12), 2);
utils_1.test(calculateFuelMass(14), 2);
utils_1.test(calculateFuelMass(1969), 654);
utils_1.test(calculateFuelMass(100756), 33583);
utils_1.test(calculateCorrectFuelMass(14), 2);
utils_1.test(calculateCorrectFuelMass(1969), 966);
utils_1.test(calculateCorrectFuelMass(100756), 50346);
utils_1.test(calculateTotalFuelMass([12, 14, 1969, 100756], calculateFuelMass), 2 + 2 + 654 + 33583);
utils_1.test(calculateTotalFuelMass([14, 1969, 100756], calculateCorrectFuelMass), 2 + 966 + 50346);
/* Results */
console.time("Time");
const resultA = calculateTotalFuelMass(input, calculateFuelMass);
const resultB = calculateTotalFuelMass(input, calculateCorrectFuelMass);
console.timeEnd("Time");
console.log("Solution to part 1:", resultA); // -> 3515171
console.log("Solution to part 2:", resultB); // -> 5269882
