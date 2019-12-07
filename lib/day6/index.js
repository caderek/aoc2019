"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../utils/index");
const graphlib_1 = require("graphlib");
const input = index_1.readInput();
const prepareGraph = (input) => input
    .split("\n")
    .reduce((g, x) => g.setEdge(...x.split(")")), new graphlib_1.Graph());
const countOrbits = (g) => Object.values(graphlib_1.alg.dijkstra(g, "COM")).reduce((sum, { distance }) => sum + distance, 0);
const countOrbitalTransfers = (g) => graphlib_1.alg.dijkstra(g, "YOU", null, g.nodeEdges.bind(g)).SAN.distance - 2;
/* Tests */
index_1.test(countOrbits(prepareGraph("COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L")), 42);
index_1.test(countOrbitalTransfers(prepareGraph("COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L\nK)YOU\nI)SAN")), 4);
/* Results */
console.time("Time");
const graph = prepareGraph(input);
const resultA = countOrbits(graph);
const resultB = countOrbitalTransfers(graph);
console.timeEnd("Time");
console.log("Solution to part 1:", resultA); // -> 300598
console.log("Solution to part 2:", resultB); // -> 520
