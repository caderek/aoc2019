import { test, readInput } from "../utils/index"
import { last_, butLast_ } from "@arrows/array"

const input = readInput()

const jumps = { 1: 4, 2: 4, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4 }

const ops = {
  ADD: 1,
  MULTIPLY: 2,
  INPUT: 3,
  OUTPUT: 4,
  JUMP_IF_TRUE: 5,
  JUMP_IF_FALSE: 6,
  LESS_THAN: 7,
  EQUALS: 8,
}

const modes = {
  POSITION: 0,
  IMMEDIATE: 1,
}

const getValue = (
  prog: number[],
  params: number[],
  pointer: number,
  index: number,
) => {
  return prog[
    params[index] === modes.POSITION
      ? prog[pointer + index + 1]
      : pointer + index + 1
  ]
}

const compute = (input: string, inputs: number[]) => {
  const prog = input.split(",").map(Number)

  const outputs = []
  let pointer = 0

  while (true) {
    const first = String(prog[pointer]).padStart(5, "0")

    const params = first
      .substr(0, 3)
      .split("")
      .reverse()
      .map(Number)

    const opcode = Number(first.substr(3))

    let shouldJump = true

    if (opcode === 99) {
      break
    }

    const a = getValue(prog, params, pointer, 0)
    const b = getValue(prog, params, pointer, 1)

    switch (opcode) {
      case ops.ADD: {
        prog[prog[pointer + 3]] = a + b
        break
      }
      case ops.MULTIPLY: {
        prog[prog[pointer + 3]] = a * b
        break
      }
      case ops.INPUT: {
        const input = inputs.shift()
        prog[prog[pointer + 1]] = input
        break
      }
      case ops.OUTPUT: {
        outputs.push(a)
        break
      }
      case ops.JUMP_IF_TRUE: {
        pointer = a !== 0 ? b : pointer
        shouldJump = a === 0
        break
      }
      case ops.JUMP_IF_FALSE: {
        pointer = a === 0 ? b : pointer
        shouldJump = a !== 0
        break
      }
      case ops.LESS_THAN: {
        prog[prog[pointer + 3]] = a < b ? 1 : 0
        break
      }
      case ops.EQUALS: {
        prog[prog[pointer + 3]] = a === b ? 1 : 0
        break
      }
    }

    if (shouldJump) {
      pointer += jumps[opcode]
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
