enum Jumps {
  ADD = 4,
  MULTIPLY = 4,
  INPUT = 2,
  OUTPUT = 2,
  JUMP_IF_TRUE = 3,
  JUMP_IF_FALSE = 3,
  LESS_THAN = 4,
  RELATIVE_BASE_OFFSET = 2,
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
  RELATIVE_BASE_OFFSET,
  HALT = 99,
}

enum Modes {
  POSITION,
  IMMEDIATE,
  RELATIVE,
}

const unblock = () => new Promise(setImmediate)

const getValue = (
  program: number[],
  params: number[],
  pointer: number,
  index: number,
  relativeBase: number,
) => {
  return program[
    params[index] === Modes.POSITION
      ? program[pointer + index + 1]
      : params[index] === Modes.IMMEDIATE
      ? pointer + index + 1
      : relativeBase + program[pointer + index + 1]
  ]
}

const getWriteIndex = (
  program: number[],
  params: number[],
  pointer: number,
  relativeBase: number,
) => (index: number) => {
  return params[index] === Modes.RELATIVE
    ? relativeBase + program[pointer + index + 1]
    : program[pointer + index + 1]
}

const compute = async (
  source: string,
  inputs: number[] = [],
  outputs: number[] = [],
  phaseSettings: number[] = [],
  freeMemorySize: number = 100,
) => {
  const program = source
    .split(",")
    .map(Number)
    .concat(Array.from({ length: freeMemorySize }, () => 0))

  let pointer = 0
  let relativeBase = 0

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

    const a = getValue(program, params, pointer, 0, relativeBase)
    const b = getValue(program, params, pointer, 1, relativeBase)

    const getIndex = getWriteIndex(program, params, pointer, relativeBase)

    switch (opcode) {
      case Ops.ADD: {
        program[getIndex(2)] = a + b
        break
      }
      case Ops.MULTIPLY: {
        program[getIndex(2)] = a * b
        break
      }
      case Ops.INPUT: {
        if (phaseSettings.length > 0) {
          program[getIndex(0)] = phaseSettings.shift()
        } else if (inputs.length > 0) {
          program[getIndex(0)] = inputs.shift()
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
        program[getIndex(2)] = a < b ? 1 : 0
        break
      }
      case Ops.EQUALS: {
        program[getIndex(2)] = a === b ? 1 : 0
        break
      }
      case Ops.RELATIVE_BASE_OFFSET: {
        relativeBase += a
        break
      }
    }

    if (shouldJump) {
      pointer += Jumps[Ops[opcode]]
    }
  }

  return outputs
}

export default compute
