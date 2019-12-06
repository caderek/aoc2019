import { test, readInput } from "../utils/index"
import { alg, Graph, Edge } from "graphlib"

const input = readInput()

const prepareGraph = (input: string) => {
  return input
    .split("\n")
    .reduce(
      (g, x) => g.setEdge(...(x.split(")") as [string, string])),
      new Graph(),
    )
}

const countOrbits = (g: Graph) => {
  return Object.values(alg.dijkstra(g, "COM")).reduce(
    (sum, { distance }) => sum + distance,
    0,
  )
}

const countOrbitalTransfers = (g: Graph) => {
  return alg.dijkstra(g, "YOU", null, g.nodeEdges.bind(g)).SAN.distance - 2
}

/* Tests */

test(
  countOrbits(
    prepareGraph("COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L"),
  ),
  42,
)

test(
  countOrbitalTransfers(
    prepareGraph(
      "COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L\nK)YOU\nI)SAN",
    ),
  ),
  4,
)

/* Results */

console.time("Time")
const graph = prepareGraph(input)
const resultA = countOrbits(graph)
const resultB = countOrbitalTransfers(graph)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA) // -> 300598
console.log("Solution to part 2:", resultB) // -> 520
