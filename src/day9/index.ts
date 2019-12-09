import { test, readInput } from "../utils/index"
import compute from "./computer"

const main = async () => {
  /* Tests */

  test(
    await compute("109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99"),
    "109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99"
      .split(",")
      .map(Number),
  )

  test(
    await compute("1102,34915192,34915192,7,4,7,99,0").then(
      (x) => String(x).length,
    ),
    16,
  )

  test(await compute("104,1125899906842624,99"), [1125899906842624])

  /* Results */

  const input = readInput()

  console.time("Time")
  const [resultA] = await compute(input, [1])
  const [resultB] = await compute(input, [2])
  console.timeEnd("Time")

  console.log("Solution to part 1:")
  console.log(resultA) // -> 2399197539
  console.log("Solution to part 2:")
  console.log(resultB) // -> 35106
}

main()
