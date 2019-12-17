import { readInput } from "../utils/index"
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

type PanelData = {
  x: number
  y: number
  dir: Dir
  color: Color
}

const goA = async (source: string, startValue: number) => {
  const inputs = [startValue]
  const outputs = []
  let done = false

  compute(source, inputs, outputs).then(() => (done = true))

  const panels = new Map()
  const now = { x: 0, y: 0, dir: Dir.UP, color: Color.BLACK }

  while (!done) {
    if (outputs.length === 0) {
      await unblock()
    }

    const color = Number(outputs.shift())
    const turn = Number(outputs.shift())

    panels.set(`${now.x},${now.y}`, { ...now, color })

    if (turn === Dir.LEFT) {
      now.dir =
        now.dir === Dir.UP
          ? Dir.LEFT
          : now.dir === Dir.LEFT
          ? Dir.DOWN
          : now.dir === Dir.DOWN
          ? Dir.RIGHT
          : Dir.UP
    }

    if (turn === Dir.RIGHT) {
      now.dir =
        now.dir === Dir.UP
          ? Dir.RIGHT
          : now.dir === Dir.RIGHT
          ? Dir.DOWN
          : now.dir === Dir.DOWN
          ? Dir.LEFT
          : Dir.UP
    }

    now.x += now.dir === Dir.LEFT ? -1 : now.dir === Dir.RIGHT ? 1 : 0
    now.y += now.dir === Dir.UP ? -1 : now.dir === Dir.DOWN ? 1 : 0

    const id = `${now.x},${now.y}`
    now.color = panels.has(id) ? panels.get(id).color : Color.BLACK

    inputs.push(now.color)
  }

  return [...panels.values()]
}

const goB = async (panelsData: Promise<PanelData[]>) => {
  const data = await panelsData

  const w = Math.max(...data.map(({ x }) => x)) + 1
  const h = Math.max(...data.map(({ y }) => y)) + 1

  const emptyGrid = Array.from({ length: h }, () =>
    Array.from({ length: w }, () => " "),
  )

  return data
    .reduce((grid, { x, y, color }) => {
      grid[y][x] = color === Color.BLACK ? " " : "#"
      return grid
    }, emptyGrid)
    .map((row) => row.join(""))
    .join("\n")
}

const main = async () => {
  /* Results */

  const input = readInput()

  console.time("Time")
  const resultA = await goA(input, 0)
  // const resultB = await goB(goA(input, 1))
  console.timeEnd("Time")

  console.log("Solution to part 1:", resultA.length) // -> 1967
  console.log("Solution to part 2:")
  // console.log(resultB)

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
