"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../utils/index");
const array_1 = require("@arrows/array");
const input = array_1.range_(359282, 820401).map(String);
const isAscending = (str) => str.match(/^0*1*2*3*4*5*6*7*8*9*$/);
const goA = (input) => input.filter((pass) => pass.match(/(.)\1/) && isAscending(pass)).length;
const goB = (input) => input.filter((pass) => (pass.match(/(.)\1+/g) || []).some((x) => x.length === 2) &&
    isAscending(pass)).length;
/* Tests */
index_1.test(goA(["111111"]), 1);
index_1.test(goA(["123012"]), 0);
index_1.test(goA(["123456"]), 0);
index_1.test(goA(["123456", "111111", "123345"]), 2);
index_1.test(goB(["111111"]), 0);
index_1.test(goB(["123012"]), 0);
index_1.test(goB(["123466"]), 1);
index_1.test(goB(["111166"]), 1);
index_1.test(goB(["222446", "111111", "123345"]), 2);
/* Results */
console.time("Time");
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd("Time");
console.log("Solution to part 1:", resultA); // -> 511
console.log("Solution to part 2:", resultB); // -> 316
