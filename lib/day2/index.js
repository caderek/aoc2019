"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const rawInput = utils_1.readInput();
const go = (input, noun, verb) => {
    const arr = input.split(",").map(Number);
    arr[1] = (noun !== null && noun !== void 0 ? noun : arr[1]);
    arr[2] = (verb !== null && verb !== void 0 ? verb : arr[2]);
    for (let i = 0; arr[i] !== 99; i += 4) {
        arr[arr[i + 3]] =
            arr[i] === 1
                ? arr[arr[i + 1]] + arr[arr[i + 2]]
                : arr[arr[i + 1]] * arr[arr[i + 2]];
    }
    return arr;
};
const brute = (input, target) => {
    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
            const x = go(input, i, j)[0];
            if (x === target) {
                return 100 * i + j;
            }
        }
    }
};
/* Tests */
utils_1.test(go("1,0,0,0,99"), [2, 0, 0, 0, 99]);
utils_1.test(go("2,3,0,3,99"), [2, 3, 0, 6, 99]);
utils_1.test(go("2,4,4,5,99,0"), [2, 4, 4, 5, 99, 9801]);
utils_1.test(go("1,1,1,4,99,5,6,0,99"), [30, 1, 1, 4, 2, 5, 6, 0, 99]);
utils_1.test(brute("1,0,0,0,99", 2), 0);
utils_1.test(brute(rawInput, 5290681), 1202);
/* Results */
console.time("Time");
const resultA = go(rawInput, 12, 2)[0];
const resultB = brute(rawInput, 19690720);
console.timeEnd("Time");
console.log("Solution to part 1:", resultA); // -> 5290681
console.log("Solution to part 2:", resultB); // -> 5741
