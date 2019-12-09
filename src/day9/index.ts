import * as R from "ramda"
import { arr, com, dis, mul } from "@arrows/arrows"
import { test, readInput } from "../utils/index"
import compute from "./computer"

const prepareInput = (rawInput: string) => rawInput

const go = async (rawInput: string, input?: bigint) => {
  const source = prepareInput(rawInput)

  const output = await compute(source, [input], [], [])
  return output
}

const main = async () => {
  /* Tests */

  test(
    await go("109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99"),
    "109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99"
      .split(",")
      .map(BigInt),
  )
  test(await go("1102,34915192,34915192,7,4,7,99,0"), [1219070632396864n])
  test(await go("104,1125899906842624,99"), [1125899906842624n])

  /* Results */

  const input = readInput()

  console.time("Time")
  // @ts-ignore
  const resultA = await go(input, 1n)
  const resultB = await go(input, 2n)
  console.timeEnd("Time")

  console.log("Solution to part 1:")
  console.log(resultA[0])
  console.log("Solution to part 2:")
  console.log(resultB[0])
}

main()
