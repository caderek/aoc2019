import logUpdate from "log-update"
import * as kleur from "kleur"
import { readInput, arr } from "../utils/index"
import compute, { unblock } from "./computer"

type State = [number, number, number][]

const tiles = {
  0: " ",
  1: kleur.blue("H"),
  2: kleur.green("#"),
  3: kleur.red("–"),
  4: kleur.yellow("●"),
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const renderer = (grid = null) => async (state: State, score = 0) => {
  const w = Math.max(...state.map((tile) => tile[0])) + 1
  const h = Math.max(...state.map((tile) => tile[1])) + 1

  const board = grid
    ? grid
    : Array.from({ length: h }, () => Array.from({ length: w }, () => " "))

  grid = board

  state.forEach(([x, y, id]) => {
    board[y][x] = tiles[id]
  })

  const screen = board.map((row) => row.join("")).join("\n")
  logUpdate(`\nScore: ${score}\n${screen}\n`)
  await delay(10)
}

const goA = async (source: string) => {
  const game = await compute(source)
  const state = arr.chunk_(3, game) as State

  /* Uncomment the next line to draw the board */
  // await renderer()(state)

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
  const draw = renderer()

  do {
    await unblock()

    const out = []

    while (outputs.length > 0) {
      out.push(outputs.shift())
    }

    const state = arr.chunk_(3, out) as State

    const currentScore = state.find(([x, y]) => x === -1 && y === 0)
    const paddle = state.find((tile) => tile[2] === 3)
    const ball = state.find((tile) => tile[2] === 4)

    ballX = ball ? ball[0] : ballX
    paddleX = paddle ? paddle[0] : paddleX
    score = currentScore ? currentScore[2] : score

    /* Uncomment the next line to draw the board */
    // await draw(state, score)

    const move = paddleX < ballX ? 1 : paddleX > ballX ? -1 : 0
    paddleX += move
    inputs.push(move)
  } while (!done)

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
