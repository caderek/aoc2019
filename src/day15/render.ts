import logUpdate from "log-update"
import * as kleur from "kleur"
import { graph, arr } from "../utils/index"

enum RenderOnlyStatus {
  DROID_PATH = 3,
  OXYGEN_PATH,
  OXYGEN_END,
}

type X = number
type Y = number
type Tag = string
type DroidStatuses = 1 | 2 | 2
type AdditionalStatuses = 3 | 4 | 5
type Id = DroidStatuses | AdditionalStatuses

export type Waypoint = [X, Y, Tag, Id]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const tiles = {
  0: kleur.gray("\u2588\u2588"),
  1: "  ",
  2: kleur.yellow("\u2588\u2588"),
  3: kleur.yellow().dim("\u2588\u2588"),
  4: kleur.cyan().dim("\u2588\u2588"),
  5: kleur.white("\u2588\u2588"),
}

const draw = (data, droid) => {
  const minX = Math.abs(Math.min(...data.map((item) => item[0])))
  const minY = Math.abs(Math.min(...data.map((item) => item[1])))

  const grid = []

  data.forEach(([x, y, id]) => {
    if (!grid[y + minY]) {
      grid[y + minY] = []
    }
    grid[y + minY][x + minX] = id
  })

  const maxWidth = Math.max(...grid.map((row) => row.length))

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < maxWidth; col++) {
      if (grid[row][col] === undefined) {
        grid[row][col] =
          droid[0] === 0 && droid[1] === 0 ? tiles[0] : kleur.gray("?¿")
      } else {
        grid[row][col] = tiles[grid[row][col]]
      }
    }
  }

  grid[droid[1] + minY][droid[0] + minX] = kleur.red("\u2588\u2588")

  const render = grid.map((row) => row.join("")).join("\n")

  logUpdate(`\n${render}\n`)
}

const drawPaths = async (
  g: graph.Graph,
  target: string,
  map: Map<string, number[]>,
) => {
  let temp = target

  while (true) {
    const pred = g.predecessors(temp)
    if (pred[0] === "0,0") {
      break
    }
    temp = pred[0]
    map.set(temp, [...temp.split(",").map(Number), 3])
    draw([...map.values()], [0, 0])
    await delay(20)
  }

  const o2paths = graph.alg.dijkstra(g, target, null, g.nodeEdges.bind(g))
  const byMinutes = Object.values(
    arr.groupBy_(
      (x) => String(x.distance),
      Object.entries(o2paths).map(([id, { distance }]) => ({ id, distance })),
    ),
  ).slice(1)

  for (const points of byMinutes) {
    for (const { id } of points) {
      map.set(id, [...id.split(",").map(Number), 4])
    }
    draw([...map.values()], [0, 0])
    await delay(20)
  }

  const last = arr.last_(byMinutes)[0]
  map.set(last.id, [...last.id.split(",").map(Number), 5])
  draw([...map.values()], [0, 0])
}

export { draw, drawPaths }
