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

const unblock = () => new Promise(setImmediate)

const calculations: { [key: string]: (a: bigint, b: bigint) => bigint } = {
  [Ops.ADD]: (a, b) => a + b,
  [Ops.MULTIPLY]: (a, b) => a * b,
  [Ops.LESS_THAN]: (a, b) => BigInt(a < b),
  [Ops.EQUALS]: (a, b) => BigInt(a === b),
}

const getValue = (
  program: Map<bigint, bigint>,
  params: number[],
  pointer: bigint,
  index: number,
  relativeBase: bigint,
) => {
  return program.get(
    params[index] === Modes.POSITION
      ? program.get(pointer + BigInt(index) + 1n)
      : params[index] === Modes.IMMEDIATE
      ? pointer + BigInt(index) + 1n
      : relativeBase + program.get(pointer + BigInt(index) + 1n),
  )
}

const getWriteIndex = (
  program: Map<bigint, bigint>,
  params: number[],
  pointer: bigint,
  relativeBase: bigint,
) => (index: number) => {
  return params[index] === Modes.RELATIVE
    ? relativeBase + BigInt(program.get(pointer + BigInt(index) + 1n))
    : program.get(pointer + BigInt(index) + 1n)
}

const compute = async (
  source: string,
  inputs: bigint[] = [],
  outputs: bigint[] = [],
  phaseSettings: bigint[] = [],
  freeMemorySize: number = 100,
) => {
  const program = new Map(
    source
      .split(",")
      .map(BigInt)
      .concat(Array.from({ length: freeMemorySize }, () => 0n))
      .map((val, i) => [BigInt(i), val]),
  )

  let pointer = 0n
  let relativeBase = 0n

  while (true) {
    const first = String(program.get(pointer)).padStart(5, "0")

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
      case Ops.ADD:
      case Ops.MULTIPLY:
      case Ops.LESS_THAN:
      case Ops.EQUALS: {
        program.set(getIndex(2), calculations[opcode](a, b))
        break
      }
      case Ops.INPUT: {
        if (phaseSettings.length > 0) {
          program.set(getIndex(0), phaseSettings.shift())
        } else if (inputs.length > 0) {
          program.set(getIndex(0), inputs.shift())
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

export default compute
