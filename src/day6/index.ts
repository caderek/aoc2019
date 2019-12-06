import { test, readInput } from "../utils/index"
import { Graph, DepthFirstSearch } from "js-graph-algorithms"
import { last_ } from "@arrows/array"

const input = readInput()

const prepareInput = (input: string) => {
  const orbitsMap = input.split("\n").map((x) => x.split(")"))
  const items = [...new Set(orbitsMap.flat())]
  const graph = new Graph(items.length)
  const ids = new Map(items.map((item, id) => [item, id]))

  orbitsMap.forEach(([a, b]) => graph.addEdge(ids.get(a), ids.get(b)))

  return [graph, ids] as [Graph, Map<string, number>]
}

const goA = (input: string) => {
  const [graph, ids] = prepareInput(input)
  const start = ids.get("COM")
  const dfs = new DepthFirstSearch(graph, start)

  let orbits = 0

  for (let v = 0; v < graph.V; ++v) {
    if (dfs.hasPathTo(v)) {
      orbits += dfs.pathTo(v).length - 1
    }
  }

  return orbits
}

const goB = (input: string) => {
  const [graph, ids] = prepareInput(input)
  const start = ids.get("YOU")
  const dfs = new DepthFirstSearch(graph, start)

  for (let v = 0; v < graph.V; ++v) {
    if (dfs.hasPathTo(v)) {
      const path = dfs.pathTo(v)
      if (last_(path) === ids.get("SAN")) {
        return path.length - 3
      }
    }
  }
}

/* Tests */

test(goA("COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L"), 42)

test(
  goB("COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L\nK)YOU\nI)SAN"),
  4,
)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA) // -> 300598
console.log("Solution to part 2:", resultB) // -> 520
