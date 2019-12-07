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
  HALT = 99,
}

enum Modes {
  POSITION,
  IMMEDIATE,
}

const unblock = () => new Promise((resolve) => setImmediate(resolve))

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

const compute = async (
  source: string,
  phaseSettings: number[],
  inputs: number[],
  outputs: number[],
) => {
  const program = source.split(",").map(Number)

  let pointer = 0

  while (true) {
    const first = String(program[pointer]).padStart(5, "0")

    const opcode = Number(first.substr(3))

    if (opcode === Ops.HALT) {
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
        if (phaseSettings.length > 0) {
          program[program[pointer + 1]] = phaseSettings.shift()
        } else if (inputs.length > 0) {
          program[program[pointer + 1]] = inputs.shift()
        } else {
          await unblock()
          shouldJump = false
        }
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
}

export default compute
