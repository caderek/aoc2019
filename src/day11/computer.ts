enum Jumps {
  ADD = 4,
  MULTIPLY = 4,
  INPUT = 2,
  OUTPUT = 2,
  JUMP_IF_TRUE = 3,
  JUMP_IF_FALSE = 3,
  LESS_THAN = 4,
  EQUALS = 4,
  RELATIVE_BASE_OFFSET = 2,
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

type Program = number[]

const unblock = () => new Promise(setImmediate)

const calculations: { [key: string]: (a: number, b: number) => number } = {
  [Ops.ADD]: (a, b) => a + b,
  [Ops.MULTIPLY]: (a, b) => a * b,
  [Ops.LESS_THAN]: (a, b) => Number(a < b),
  [Ops.EQUALS]: (a, b) => Number(a === b),
}

const getCell = (index: number, program: Program) => {
  if (!program[index]) {
    program[index] = 0
    return 0
  }

  return program[index]
}

const setCell = (index: number, value: number, program: Program) => {
  program[index] = value
}

const getValue = (
  program: Program,
  params: number[],
  pointer: number,
  index: number,
  relativeBase: number,
): number => {
  return getCell(
    params[index] === Modes.POSITION
      ? getCell(pointer + index + 1, program)
      : params[index] === Modes.IMMEDIATE
      ? pointer + index + 1
      : relativeBase + getCell(pointer + index + 1, program),
    program,
  )
}

const getWriteIndex = (
  program: Program,
  params: number[],
  pointer: number,
  relativeBase: number,
) => (index: number) => {
  return params[index] === Modes.RELATIVE
    ? relativeBase + getCell(pointer + index + 1, program)
    : getCell(pointer + index + 1, program)
}

const debug = (
  program: number[],
  pointer: number,
  relativeBase: number,
  opcode: Ops,
  params: number[],
  a: number,
  b: number,
  debugIndex: number,
  maxLogged = 0,
) => {
  const getIndex = getWriteIndex(program, params, pointer, relativeBase)

  if (maxLogged === 0 || debugIndex < maxLogged) {
    console.log(
      `\n[${debugIndex}]--------------------------------------------------\n`,
    )
    console.log(
      `Op: ${Ops[opcode]} | Pointer: ${pointer} | Rel base: ${relativeBase}`,
    )
    console.log(`\nParams:`)
    if (![Ops.INPUT].includes(opcode)) {
      console.log(`    a -> mode: ${Modes[params[0]]}, value: ${a}`)
    }
    if (![Ops.INPUT, Ops.OUTPUT, Ops.RELATIVE_BASE_OFFSET].includes(opcode)) {
      console.log(`    b -> mode: ${Modes[params[1]]}, value: ${b}`)
    }
    if ([Ops.ADD, Ops.MULTIPLY, Ops.LESS_THAN, Ops.EQUALS].includes(opcode)) {
      console.log(`\nSave to:`)
      console.log(`    -> mode: ${Modes[params[2]]}, address: ${getIndex(2)}`)
    }
    if ([Ops.INPUT].includes(opcode)) {
      console.log(`\nSave to:`)
      console.log(`    -> mode: ${Modes[params[0]]}, address: ${getIndex(0)}`)
    }
  }
}

const compute = async (
  source: string,
  inputs: number[] = [],
  outputs: number[] = [],
  phaseSettings: number[] = [],
) => {
  const program = source.split(",").map(Number)

  // console.log("Spawned VM, initial state:")
  // console.log({ inputs, outputs, phaseSettings })

  let pointer = 0
  let relativeBase = 0
  let debugIndex = 0

  while (true) {
    const first = String(getCell(pointer, program)).padStart(5, "0")

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

    const a: number = getValue(program, params, pointer, 0, relativeBase)
    const b: number = getValue(program, params, pointer, 1, relativeBase)

    const getIndex = getWriteIndex(program, params, pointer, relativeBase)

    debug(
      program,
      pointer,
      relativeBase,
      opcode,
      params,
      a,
      b,
      debugIndex++,
      10,
    )

    switch (opcode) {
      case Ops.ADD:
      case Ops.MULTIPLY:
      case Ops.LESS_THAN:
      case Ops.EQUALS: {
        setCell(getIndex(2), calculations[opcode](a, b), program)
        break
      }
      case Ops.INPUT: {
        if (phaseSettings.length > 0) {
          setCell(getIndex(0), phaseSettings.shift(), program)
        } else if (inputs.length > 0) {
          setCell(getIndex(0), inputs.shift(), program)
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

export { unblock }
export default compute
