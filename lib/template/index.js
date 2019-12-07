"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../utils/index");
const prepareInput = (rawInput) => rawInput;
const input = prepareInput(index_1.readInput());
const goA = (input) => {
    return;
};
const goB = (input) => {
    return;
};
/* Tests */
// test()
/* Results */
console.time("Time");
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd("Time");
console.log("Solution to part 1:", resultA);
console.log("Solution to part 2:", resultB);
