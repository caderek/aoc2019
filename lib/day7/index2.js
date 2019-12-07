"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../utils/index");
const work_1 = require("./work");
const prepareInput = (rawInput) => rawInput;
const input = prepareInput(index_1.readInput());
const goB = async (source) => {
    const results = [];
    for (let i = 5; i < 10; i++) {
        for (let j = 5; j < 10; j++) {
            for (let k = 5; k < 10; k++) {
                for (let l = 5; l < 10; l++) {
                    for (let m = 5; m < 10; m++) {
                        if ([...new Set([i, j, k, l, m])].length === 5) {
                            const bufferSize = 8;
                            const out1 = new Int32Array(new SharedArrayBuffer(bufferSize));
                            out1[0] = 0;
                            out1[1] = 0;
                            const out2 = new Int32Array(new SharedArrayBuffer(bufferSize));
                            out2[0] = 0;
                            out2[1] = 0;
                            const out3 = new Int32Array(new SharedArrayBuffer(bufferSize));
                            out3[0] = 0;
                            out3[1] = 0;
                            const out4 = new Int32Array(new SharedArrayBuffer(bufferSize));
                            out4[0] = 0;
                            out4[1] = 0;
                            const out5 = new Int32Array(new SharedArrayBuffer(bufferSize));
                            out5[0] = 0;
                            out5[1] = 1;
                            const payload1 = {
                                source,
                                initialInput: new Int32Array([i, 1]),
                                inputs: out5,
                                outputs: out1,
                                name: 1,
                            };
                            const payload2 = {
                                source,
                                initialInput: new Int32Array([j, 1]),
                                inputs: out1,
                                outputs: out2,
                                name: 2,
                            };
                            const payload3 = {
                                source,
                                initialInput: new Int32Array([k, 1]),
                                inputs: out2,
                                outputs: out3,
                                name: 3,
                            };
                            const payload4 = {
                                source,
                                initialInput: new Int32Array([l, 1]),
                                inputs: out3,
                                outputs: out4,
                                name: 4,
                            };
                            const payload5 = {
                                source,
                                initialInput: new Int32Array([m, 1]),
                                inputs: out4,
                                outputs: out5,
                                name: 5,
                            };
                            const result = await Promise.all([
                                work_1.default(payload1),
                                work_1.default(payload2),
                                work_1.default(payload3),
                                work_1.default(payload4),
                                work_1.default(payload5),
                            ]);
                            results.push(result.find((x) => x.name === 5).result);
                        }
                    }
                }
            }
        }
    }
    console.log({ results });
    return Math.max(...results);
};
/* Tests */
// test(goA("3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0"), 43210)
/* Results */
const main = async () => {
    console.time("Time");
    // const resultA = goA(input)
    const resultB = await goB(input);
    console.timeEnd("Time");
    // console.log("Solution to part 1:", resultA)
    console.log("Solution to part 2:", resultB);
};
main();
