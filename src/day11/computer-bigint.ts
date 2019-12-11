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

type Program = Map<bigint, bigint>

const unblock = () => new Promise(setImmediate)

const calculations: { [key: string]: (a: bigint, b: bigint) => bigint } = {
  [Ops.ADD]: (a, b) => a + b,
  [Ops.MULTIPLY]: (a, b) => a * b,
  [Ops.LESS_THAN]: (a, b) => BigInt(a < b),
  [Ops.EQUALS]: (a, b) => BigInt(a === b),
}

const getCell = (index: bigint, program: Program) => {
  if (!program.has(index)) {
    program.set(index, 0n)
    return 0n
  }

  return program.get(index)
}

const setCell = (index: bigint, value: bigint, program: Program) => {
  program.set(index, value)
}

const getValue = (
  program: Program,
  params: number[],
  pointer: bigint,
  index: number,
  relativeBase: bigint,
): bigint => {
  return getCell(
    params[index] === Modes.POSITION
      ? getCell(pointer + BigInt(index) + 1n, program)
      : params[index] === Modes.IMMEDIATE
      ? pointer + BigInt(index) + 1n
      : relativeBase + getCell(pointer + BigInt(index) + 1n, program),
    program,
  )
}

const getWriteIndex = (
  program: Program,
  params: number[],
  pointer: bigint,
  relativeBase: bigint,
) => (index: number) => {
  return params[index] === Modes.RELATIVE
    ? relativeBase + BigInt(getCell(pointer + BigInt(index) + 1n, program))
    : getCell(pointer + BigInt(index) + 1n, program)
}

const compute = async (
  source: string,
  inputs: bigint[] = [],
  outputs: bigint[] = [],
  phaseSettings: bigint[] = [],
) => {
  const program = new Map(
    source
      .split(",")
      .map(BigInt)
      .map((val, i) => [BigInt(i), val]),
  )

  let pointer = 0n
  let relativeBase = 0n

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

    const a: bigint = getValue(program, params, pointer, 0, relativeBase)
    const b: bigint = getValue(program, params, pointer, 1, relativeBase)

    const getIndex = getWriteIndex(program, params, pointer, relativeBase)

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
        pointer = a !== 0n ? b : pointer
        shouldJump = a === 0n
        break
      }
      case Ops.JUMP_IF_FALSE: {
        pointer = a === 0n ? b : pointer
        shouldJump = a !== 0n
        break
      }
      case Ops.RELATIVE_BASE_OFFSET: {
        relativeBase += a
        break
      }
    }

    if (shouldJump) {
      pointer += BigInt(Jumps[Ops[opcode]])
    }
  }

  return outputs
}

export { unblock }
export default compute
