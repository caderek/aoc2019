import { readInput, arr } from "../utils/index"
import compute, { unblock } from "./computer"

const goA = async (source: string) => {
  const inputBuffers = Array.from({ length: 50 }, () => [])
  const outputBuffers = Array.from({ length: 50 }, () => [])

  inputBuffers.forEach((inputs, i) =>
    compute(source, inputs, outputBuffers[i], [i]),
  )

  while (true) {
    await unblock()
    const packets = outputBuffers.map((buffer) => arr.chunk_(3, buffer)).flat()

    const address255 = packets.find((x) => x[0] === 255)

    if (address255 !== undefined) {
      return address255[2]
    }

    outputBuffers.forEach((buffer) => {
      const out = []
      while (buffer.length > 0) {
        out.push(buffer.shift())
      }

      arr.chunk_(3, out).forEach(([address, X, Y]) => {
        inputBuffers[address].push(X)
        inputBuffers[address].push(Y)
      })
    })

    inputBuffers.forEach((buffer) => buffer.length === 0 && buffer.push(-1))
  }
}

const goB = async (source: string) => {
  const inputBuffers = Array.from({ length: 50 }, () => [])
  const outputBuffers = Array.from({ length: 50 }, () => [])

  inputBuffers.forEach((inputs, i) =>
    compute(source, inputs, outputBuffers[i], [i]),
  )

  let prevNat = [-1, -1]
  let nat = []

  while (true) {
    await unblock()

    if (
      inputBuffers.every((x) => x.length === 0) &&
      outputBuffers.every((x) => x.length === 0)
    ) {
      inputBuffers[0].push(nat[0])
      inputBuffers[0].push(nat[1])
    }

    if (nat[1] === prevNat[1]) {
      return nat[1]
    }

    outputBuffers.forEach((buffer) => {
      const out = []
      while (buffer.length > 0) {
        out.push(buffer.shift())
      }

      arr.chunk_(3, out).forEach(([address, X, Y]) => {
        if (address === 255) {
          prevNat = nat
          nat = [X, Y]
        } else {
          inputBuffers[address].push(X)
          inputBuffers[address].push(Y)
        }
      })
    })

    inputBuffers.forEach((buffer) => buffer.length === 0 && buffer.push(-1))
  }
}

/* Results */

const main = async () => {
  const input = readInput()

  console.time("Time")
  const resultA = await goA(input)
  const resultB = await goB(input)
  console.timeEnd("Time")

  console.log("Solution to part 1:", resultA) // -> 17541
  console.log("Solution to part 2:", resultB) // -> 12415
}

main()
