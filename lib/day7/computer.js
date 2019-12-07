"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Jumps;
(function (Jumps) {
    Jumps[Jumps["ADD"] = 4] = "ADD";
    Jumps[Jumps["MULTIPLY"] = 4] = "MULTIPLY";
    Jumps[Jumps["INPUT"] = 2] = "INPUT";
    Jumps[Jumps["OUTPUT"] = 2] = "OUTPUT";
    Jumps[Jumps["JUMP_IF_TRUE"] = 3] = "JUMP_IF_TRUE";
    Jumps[Jumps["JUMP_IF_FALSE"] = 3] = "JUMP_IF_FALSE";
    Jumps[Jumps["LESS_THAN"] = 4] = "LESS_THAN";
    Jumps[Jumps["EQUALS"] = 4] = "EQUALS";
})(Jumps || (Jumps = {}));
var Ops;
(function (Ops) {
    Ops[Ops["ADD"] = 1] = "ADD";
    Ops[Ops["MULTIPLY"] = 2] = "MULTIPLY";
    Ops[Ops["INPUT"] = 3] = "INPUT";
    Ops[Ops["OUTPUT"] = 4] = "OUTPUT";
    Ops[Ops["JUMP_IF_TRUE"] = 5] = "JUMP_IF_TRUE";
    Ops[Ops["JUMP_IF_FALSE"] = 6] = "JUMP_IF_FALSE";
    Ops[Ops["LESS_THAN"] = 7] = "LESS_THAN";
    Ops[Ops["EQUALS"] = 8] = "EQUALS";
    Ops[Ops["HALT"] = 99] = "HALT";
})(Ops || (Ops = {}));
var Modes;
(function (Modes) {
    Modes[Modes["POSITION"] = 0] = "POSITION";
    Modes[Modes["IMMEDIATE"] = 1] = "IMMEDIATE";
})(Modes || (Modes = {}));
const getValue = (program, params, pointer, index) => {
    return program[params[index] === Modes.POSITION
        ? program[pointer + index + 1]
        : pointer + index + 1];
};
const compute = (source, initialInput, inputs, outputs) => {
    const program = source.split(",").map(Number);
    let pointer = 0;
    while (true) {
        const first = String(program[pointer]).padStart(5, "0");
        const opcode = Number(first.substr(3));
        if (opcode === Ops.HALT) {
            break;
        }
        const params = first
            .substr(0, 3)
            .split("")
            .reverse()
            .map(Number);
        let shouldJump = true;
        const a = getValue(program, params, pointer, 0);
        const b = getValue(program, params, pointer, 1);
        switch (opcode) {
            case Ops.ADD: {
                program[program[pointer + 3]] = a + b;
                break;
            }
            case Ops.MULTIPLY: {
                program[program[pointer + 3]] = a * b;
                break;
            }
            case Ops.INPUT: {
                if (initialInput.length > 0) {
                    program[program[pointer + 1]] = initialInput.shift();
                }
                else if (inputs.length > 0) {
                    program[program[pointer + 1]] = inputs.shift();
                }
                else {
                    shouldJump = false;
                }
                break;
            }
            case Ops.OUTPUT: {
                outputs.push(a);
                break;
            }
            case Ops.JUMP_IF_TRUE: {
                pointer = a !== 0 ? b : pointer;
                shouldJump = a === 0;
                break;
            }
            case Ops.JUMP_IF_FALSE: {
                pointer = a === 0 ? b : pointer;
                shouldJump = a !== 0;
                break;
            }
            case Ops.LESS_THAN: {
                program[program[pointer + 3]] = a < b ? 1 : 0;
                break;
            }
            case Ops.EQUALS: {
                program[program[pointer + 3]] = a === b ? 1 : 0;
                break;
            }
        }
        if (shouldJump) {
            pointer += Jumps[Ops[opcode]];
        }
    }
};
exports.default = compute;
