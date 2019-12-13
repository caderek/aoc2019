import { readInput, arr } from "../utils/index"
import compute, { unblock } from "./computer"

type State = [number, number, number][]

const goA = async (source: string) => {
  const game = await compute(source)
  const state = arr.chunk_(3, game) as State

  return state.filter((tile) => tile[2] === 2).length
}

const goB = async (source: string) => {
  const hackedSource = "2" + source.slice(1)
  const inputs = []
  const outputs = []
  let done = false

  compute(hackedSource, inputs, outputs).then(() => (done = true))

  let score = 0
  let paddleX = 0
  let ballX = 0

  while (!done) {
    await unblock()

    const out = []

    while (outputs.length > 0) {
      out.push(outputs.shift())
    }

    const state = arr.chunk_(3, out)

    const currentScore = state.find(([x, y]) => x === -1 && y === 0)
    const paddle = state.find(([x, y, tile]) => tile === 3)
    const ball = state.find(([x, y, tile]) => tile === 4)

    ballX = ball ? ball[0] : ballX
    paddleX = paddle ? paddle[0] : paddleX
    score = currentScore ? currentScore[2] : score

    const move = paddleX < ballX ? 1 : paddleX > ballX ? -1 : 0
    paddleX += move
    inputs.push(move)
  }

  return score
}

const main = async () => {
  /* Results */

  const input = readInput()

  console.time("Time")
  const resultA = await goA(input)
  const resultB = await goB(input)
  console.timeEnd("Time")

  console.log("Solution to part 1:", resultA) // -> 432
  console.log("Solution to part 2:", resultB) // -> 22225
}

main()
