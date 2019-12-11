import * as R from "ramda"
import * as iter from "iter-tools"
import { arr, com, dis, mul } from "@arrows/arrows"
import { test, readInput } from "../utils/index"
import compute, { unblock } from "./computer"

enum Color {
  BLACK,
  WHITE,
}

enum Dir {
  LEFT,
  RIGHT,
  UP,
  DOWN,
}

const goA = async (source: string, startValue: bigint) => {
  const inputs = [startValue]
  const outputs = []
  let done = false

  compute(source, inputs, outputs).then(() => (done = true))

  const panels = new Map()
  const current = { x: 0, y: 0, dir: Dir.UP, color: Color.BLACK }

  while (!done) {
    if (outputs.length === 0) {
      await unblock()
    }

    const color = Number(outputs.shift())
    const turn = Number(outputs.shift())

    panels.set(`${current.x},${current.y}`, {
      x: current.x,
      y: current.y,
      dir: current.dir,
      color,
    })

    if (turn === Dir.LEFT) {
      current.dir =
        current.dir === Dir.UP
          ? Dir.LEFT
          : current.dir === Dir.LEFT
          ? Dir.DOWN
          : current.dir === Dir.DOWN
          ? Dir.RIGHT
          : Dir.UP
    }

    if (turn === Dir.RIGHT) {
      current.dir =
        current.dir === Dir.UP
          ? Dir.RIGHT
          : current.dir === Dir.RIGHT
          ? Dir.DOWN
          : current.dir === Dir.DOWN
          ? Dir.LEFT
          : Dir.UP
    }

    current.x =
      current.dir === Dir.LEFT
        ? current.x - 1
        : current.dir === Dir.RIGHT
        ? current.x + 1
        : current.x

    current.y =
      current.dir === Dir.UP
        ? current.y - 1
        : current.dir === Dir.DOWN
        ? current.y + 1
        : current.y

    current.color = panels.has(`${current.x},${current.y}`)
      ? panels.get(`${current.x},${current.y}`).color
      : Color.BLACK

    inputs.push(BigInt(current.color))
  }

  return [...panels.values()]
}

const goB = async (panelsData: Promise<any[]>) => {
  const data = await panelsData

  const w = Math.max(...data.map(({ x }) => x)) + 1
  const h = Math.max(...data.map(({ y }) => y)) + 1

  const grid = Array.from({ length: h }).map((row) =>
    Array.from({ length: w }, () => " "),
  )

  data.forEach(({ x, y, color }) => {
    grid[y][x] = color === Color.BLACK ? " " : "#"
  })

  return grid.map((row) => row.join("")).join("\n")
}

const main = async () => {
  /* Results */

  const input = readInput()

  console.time("Time")
  const resultA = await goA(input, 0n)
  const resultB = await goB(goA(input, 1n))
  console.timeEnd("Time")

  console.log("Solution to part 1:", resultA.length) // -> 1967
  console.log("Solution to part 2:")
  console.log(resultB)

  /* ->

  #  # ###  #  # ####  ##  #### ###  #  #   
  # #  #  # #  # #    #  #    # #  # # #    
  ##   ###  #  # ###  #      #  ###  ##     
  # #  #  # #  # #    # ##  #   #  # # #    
  # #  #  # #  # #    #  # #    #  # # #    
  #  # ###   ##  ####  ### #### ###  #  #   

  */
}

main()
