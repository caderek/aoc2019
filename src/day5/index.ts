import { test, readInput } from "../utils/index"
import { last_, butLast_ } from "@arrows/array"

const input = readInput()

enum Jumps {
  ADD = 4,
  MULTIPLY = 4,
  INPUT = 2,
  OUTPUT = 2,
  JUMP_IF_TRUE = 3,
  JUMP_IF_FALSE = 3,
  LESS_THAN = 4,
  EQUALS = 4,
}

enum Ops {
  ADD = 1,
  MULTIPLY,
  INPUT,
  OUTPUT,
  JUMP_IF_TRUE,
  JUMP_IF_FALSE,
  LESS_THAN,
  EQUALS,
}

enum Modes {
  POSITION,
  IMMEDIATE,
}

const getValue = (
  program: number[],
  params: number[],
  pointer: number,
  index: number,
) => {
  return program[
    params[index] === Modes.POSITION
      ? program[pointer + index + 1]
      : pointer + index + 1
  ]
}

const compute = (source: string, inputs: number[]) => {
  const program = source.split(",").map(Number)

  const outputs = []
  let pointer = 0

  while (true) {
    const first = String(program[pointer]).padStart(5, "0")

    const opcode = Number(first.substr(3))

    if (opcode === 99) {
      break
    }

    const params = first
      .substr(0, 3)
      .split("")
      .reverse()
      .map(Number)

    let shouldJump = true

    const a = getValue(program, params, pointer, 0)
    const b = getValue(program, params, pointer, 1)

    switch (opcode) {
      case Ops.ADD: {
        program[program[pointer + 3]] = a + b
        break
      }
      case Ops.MULTIPLY: {
        program[program[pointer + 3]] = a * b
        break
      }
      case Ops.INPUT: {
        program[program[pointer + 1]] = inputs.shift()
        break
      }
      case Ops.OUTPUT: {
        outputs.push(a)
        break
      }
      case Ops.JUMP_IF_TRUE: {
        pointer = a !== 0 ? b : pointer
        shouldJump = a === 0
        break
      }
      case Ops.JUMP_IF_FALSE: {
        pointer = a === 0 ? b : pointer
        shouldJump = a !== 0
        break
      }
      case Ops.LESS_THAN: {
        program[program[pointer + 3]] = a < b ? 1 : 0
        break
      }
      case Ops.EQUALS: {
        program[program[pointer + 3]] = a === b ? 1 : 0
        break
      }
    }

    if (shouldJump) {
      pointer += Jumps[Ops[opcode]]
    }
  }

  return outputs
}

/* Tests */

test(
  butLast_(compute(input, [1])).every((x) => x === 0),
  true,
)

const testInput =
  "3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99"

test(compute(testInput, [7]), [999])
test(compute(testInput, [8]), [1000])
test(compute(testInput, [9]), [1001])

/* Results */

console.time("Time")
const resultA = last_(compute(input, [1]))
const resultB = last_(compute(input, [5]))
console.timeEnd("Time")

console.log("Solution to part 1:", resultA) // -> 13978427
console.log("Solution to part 2:", resultB) // -> 11189491
