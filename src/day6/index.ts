import { test, readInput } from "../utils/index"
import { alg, Graph, Edge } from "graphlib"

const input = readInput()

const prepareGraph = (input: string) => {
  const orbitsMap = input.split("\n").map((x) => x.split(")"))
  const graph = new Graph()

  orbitsMap.forEach(([a, b]) => graph.setEdge(a, b))

  return graph
}

const countOrbits = (input: string) => {
  const graph = prepareGraph(input)

  return Object.entries(alg.dijkstra(graph, "COM"))
    .map(([_, { distance }]) => distance)
    .reduce((a, b) => a + b)
}

const countOrbitalTransfers = (input: string) => {
  const graph = prepareGraph(input)
  const edgeFn = graph.nodeEdges.bind(graph) as (v: string) => Edge[]

  return alg.dijkstra(graph, "YOU", null, edgeFn).SAN.distance - 2
}

/* Tests */

test(countOrbits("COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L"), 42)

test(
  countOrbitalTransfers(
    "COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L\nK)YOU\nI)SAN",
  ),
  4,
)

/* Results */

console.time("Time")
const resultA = countOrbits(input)
const resultB = countOrbitalTransfers(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA) // -> 300598
console.log("Solution to part 2:", resultB) // -> 520
