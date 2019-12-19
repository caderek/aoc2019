import { alg } from "graphlib"
import { Waypoint } from "./../day15/renderer"
import {
  test,
  readInput,
  arr,
  com,
  mul,
  dis,
  math,
  iter,
  R,
  graph,
  log,
} from "../utils/index"
import { all } from "ramda"

const prepareWeightedGraph = (
  g: graph.Graph,
  startTag: string,
  waypointsFlipped: { [tag: string]: string },
) => {
  const wg = new graph.Graph()

  const steps = graph.alg.preorder(g, [startTag])
  log({ steps })

  log({ edges: wg.edges() })

  return { wg }
}

const prepareInput = (rawInput: string) => {
  const map = rawInput.split("\n").map((row) => row.split(""))
  const points = []
  const nodes: { name: string; weight: number }[] = []

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] !== "#") {
        const id = map[y][x]
        const type =
          id === "@"
            ? "start"
            : id === "."
            ? "empty"
            : id.toUpperCase() === id
            ? "door"
            : "key"

        points.push({ tag: `${x},${y}`, x, y, id, type })
      }
    }
  }

  const tags = new Set(points.map((point) => point.tag))

  console.log(points.slice(0, 100))

  const start = points.find((point) => point.type === "start")

  console.log({ start })
}

const goA = (rawInput: string) => {
  const input = prepareInput(rawInput)

  return
}

const goB = (rawInput: string) => {
  const input = prepareInput(rawInput)

  return
}

/* Tests */

// test(goA(""), )
// test(goA(""), )

// test(goB(""), )
// test(goB(""), )

/* Results */

const input = readInput()

console.time("Time")
const resultA = goA(input)
// const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
// console.log("Solution to part 2:", resultB)
