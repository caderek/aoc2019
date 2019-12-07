"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../utils/index");
const computer_1 = require("./computer");
const array_1 = require("@arrows/array");
const prepareInput = (rawInput) => rawInput;
const input = prepareInput(index_1.readInput());
const goA = (source) => {
    const outputs = [];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            for (let k = 0; k < 5; k++) {
                for (let l = 0; l < 5; l++) {
                    for (let m = 0; m < 5; m++) {
                        if ([...new Set([i, j, k, l, m])].length === 5) {
                            const out1 = [];
                            const out2 = [];
                            const out3 = [];
                            const out4 = [];
                            const out5 = [];
                            computer_1.default(source, [i], [0], out1);
                            computer_1.default(source, [j], out1, out2);
                            computer_1.default(source, [k], out2, out3);
                            computer_1.default(source, [l], out3, out4);
                            computer_1.default(source, [m], out4, out5);
                            outputs.push(array_1.last_(out5));
                        }
                    }
                }
            }
        }
    }
    // console.log(outputs)
    return Math.max(...outputs);
};
const goB = async (source) => {
    const outputs = [];
    for (let i = 5; i < 10; i++) {
        for (let j = 5; j < 10; j++) {
            for (let k = 5; k < 10; k++) {
                for (let l = 5; l < 10; l++) {
                    for (let m = 5; m < 10; m++) {
                        if ([...new Set([i, j, k, l, m])].length === 5) {
                        }
                    }
                }
            }
        }
    }
    // console.log(outputs)
    return Math.max(...outputs);
};
/* Tests */
index_1.test(goA("3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0"), 43210);
index_1.test(goA(input), 255590);
/* Results */
const main = async () => {
    console.time("Time");
    const resultA = goA(input);
    // const resultB = await goB(input)
    console.timeEnd("Time");
    console.log("Solution to part 1:", resultA); // -> 255590
    // console.log("Solution to part 2:", resultB)
};
main();
