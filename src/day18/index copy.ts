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
  const tiles = rawInput.split("\n").map((row) => row.split(""))
  const g = new graph.Graph({ directed: false })

  const maze: { [key: string]: [string, number, number] } = {}
  const waypoints: { [key: string]: string } = {}

  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[0].length; x++) {
      if (tiles[y][x] !== "#") {
        const tag = `${x},${y}`
        maze[`${x},${y}`] = [tiles[y][x], x, y]
        if (tiles[y][x] !== ".") {
          waypoints[tiles[y][x]] = tag
        }
      }
    }
  }

  const waypointsFlipped = Object.fromEntries(
    Object.entries(waypoints).map(([id, tag]) => [tag, id]),
  )

  Object.entries(maze).forEach(([tag, [id, x, y]]) => {
    g.setNode(tag, id)

    const upTag = `${x},${y - 1}`
    const downTag = `${x},${y + 1}`
    const leftTag = `${x - 1},${y}`
    const rightTag = `${x + 1},${y}`

    g.setNode(tag, id)

    if (maze[upTag]) {
      g.setNode(upTag, maze[upTag][0])
      g.setEdge(tag, upTag)
    }
    if (maze[downTag]) {
      g.setNode(downTag, maze[downTag][0])
      g.setEdge(tag, downTag)
    }
    if (maze[leftTag]) {
      g.setNode(leftTag, maze[leftTag][0])
      g.setEdge(tag, leftTag)
    }
    if (maze[rightTag]) {
      g.setNode(rightTag, maze[rightTag][0])
      g.setEdge(tag, rightTag)
    }
  })

  const wg = prepareWeightedGraph(g, waypoints["@"], waypointsFlipped)
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
