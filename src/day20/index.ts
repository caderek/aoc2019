import { readInput, graph } from "../utils/index"

const prepareInput = (rawInput: string) =>
  rawInput.split("\n").map((row) => row.split(""))

const prepareGraph = (tiles) => {
  const maze: { [key: string]: [string, number, number] } = {}
  const waypoints: { [key: string]: string } = {}

  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[0].length; x++) {
      if (tiles[y][x] !== "#" && tiles[y][x] !== " ") {
        const tag = `${x},${y}`

        maze[`${x},${y}`] = [tiles[y][x], x, y]

        if (tiles[y][x] !== ".") {
          waypoints[tiles[y][x]] = tag
        }
      }
    }
  }

  const g = new graph.Graph({ directed: false })

  Object.entries(maze).forEach(([tag, [id, x, y]]) => {
    const upTag = `${x},${y - 1}`
    const downTag = `${x},${y + 1}`
    const leftTag = `${x - 1},${y}`
    const rightTag = `${x + 1},${y}`

    if (maze[upTag]) {
      g.setEdge(tag, upTag)
    }
    if (maze[downTag]) {
      g.setEdge(tag, downTag)
    }
    if (maze[leftTag]) {
      g.setEdge(tag, leftTag)
    }
    if (maze[rightTag]) {
      g.setEdge(tag, rightTag)
    }
  })

  g.setEdge(waypoints.b, waypoints.B)
  g.setEdge(waypoints.c, waypoints.C)
  g.setEdge(waypoints.d, waypoints.D)
  g.setEdge(waypoints.e, waypoints.E)
  g.setEdge(waypoints.f, waypoints.F)
  g.setEdge(waypoints.g, waypoints.G)
  g.setEdge(waypoints.h, waypoints.H)
  g.setEdge(waypoints.i, waypoints.I)
  g.setEdge(waypoints.j, waypoints.J)
  g.setEdge(waypoints.k, waypoints.K)
  g.setEdge(waypoints.l, waypoints.L)
  g.setEdge(waypoints.m, waypoints.M)
  g.setEdge(waypoints.n, waypoints.N)
  g.setEdge(waypoints.o, waypoints.O)
  g.setEdge(waypoints.p, waypoints.P)
  g.setEdge(waypoints.q, waypoints.Q)
  g.setEdge(waypoints.r, waypoints.R)
  g.setEdge(waypoints.s, waypoints.S)
  g.setEdge(waypoints.t, waypoints.T)
  g.setEdge(waypoints.u, waypoints.U)
  g.setEdge(waypoints.v, waypoints.V)
  g.setEdge(waypoints.w, waypoints.W)
  g.setEdge(waypoints.x, waypoints.X)
  g.setEdge(waypoints.y, waypoints.Y)
  g.setEdge(waypoints.ą, waypoints.Ą)
  g.setEdge(waypoints.ć, waypoints.Ć)
  g.setEdge(waypoints.ę, waypoints.Ę)

  return { g, waypoints }
}

const goA = (rawInput: string) => {
  const tiles = prepareInput(rawInput)
  const { g, waypoints } = prepareGraph(tiles)

  return graph.alg.dijkstra(g, waypoints.a, null, g.nodeEdges.bind(g))[
    waypoints.z
  ].distance
}

const jump = (id: string, level: number) => {
  const inc = id.toUpperCase() === id ? 1 : -1
  const newLevel = level + inc

  return newLevel >= 0 ? newLevel : 0
}

const reverseCasing = (str: string) =>
  str.toUpperCase() === str ? str.toLowerCase() : str.toUpperCase()

const hasInfiniteLoop = (arr: string[]) => {
  return arr.length > 150
}

const goB = (rawInput: string) => {
  const tiles = prepareInput(rawInput)
  const { g, waypoints } = prepareGraph(tiles)
  const waypointsByTag = Object.fromEntries(
    Object.entries(waypoints).map(([id, tag]) => [tag, id]),
  )

  const connections = {
    a: ["f", "I"],
    b: ["J"],
    c: ["D"],
    d: ["K"],
    e: ["L"],
    f: ["a", "I"],
    g: ["H"],
    h: ["z", "V"],
    i: ["Q"],
    j: ["Y"],
    k: ["Ą"],
    l: ["O"],
    m: ["S"],
    n: ["P"],
    o: ["C"],
    p: ["R"],
    q: ["U"],
    r: ["T"],
    s: ["u", "N", "B"],
    t: ["F"],
    u: ["s", "N", "B"],
    v: ["W"],
    w: ["X"],
    x: ["E"],
    y: ["Ę"],
    z: ["V"],
    ą: ["M"],
    ć: ["G"],
    ę: ["Ć"],
    B: ["N", "u", "s"],
    C: ["o"],
    D: ["c"],
    E: ["x"],
    F: ["t"],
    G: ["ć"],
    H: ["g"],
    I: ["f"],
    J: ["b"],
    K: ["d"],
    L: ["e"],
    M: ["ą"],
    N: ["B", "u", "s"],
    O: ["l"],
    P: ["n"],
    Q: ["i"],
    R: ["p"],
    S: ["m"],
    T: ["r"],
    U: ["q"],
    V: ["z", "h"],
    W: ["v"],
    X: ["w"],
    Y: ["j"],
    Ą: ["k"],
    Ć: ["ę"],
    Ę: ["y"],
    Ł: ["z"],
  }

  const recur = (from: string, level: number, previous = []) => {
    const nodes = connections[from]

    const availableNodes =
      level === 0
        ? nodes.filter(
            (node) =>
              node.toUpperCase() === node || node === "a" || node === "z",
          )
        : nodes.filter((node) => node !== "a" && node !== "z")

    if (availableNodes.length === 0 || hasInfiniteLoop(previous)) {
      return [[from]]
    }

    if (availableNodes.includes("z")) {
      return [[from, "z"]]
    }

    const prev = [...previous, from]

    return availableNodes
      .map((node) => {
        return recur(reverseCasing(node), jump(node, level), prev)
      })
      .flat()
      .map((x) => [from, ...x])
  }

  const results = recur("a", 0)

  const solutions = results.filter((r) => r[r.length - 1] === "z")

  const distances = Object.keys(waypointsByTag).map((startTag) => {
    return [
      waypointsByTag[startTag],
      Object.fromEntries(
        Object.entries(
          graph.alg.dijkstra(g, startTag, null, g.nodeEdges.bind(g)),
        )
          .filter(
            ([tag, info]) => waypointsByTag[tag] && info.distance !== Infinity,
          )
          .map(([tag, info]) => [waypointsByTag[tag], info.distance])
          // @ts-ignore
          .sort(([_, a], [__, b]) => a - b),
      ),
    ]
  })

  const dis = Object.fromEntries(distances)

  const solutionsDistances = solutions.map((solution) =>
    solution.reduce((sum, item, i) => {
      const next = solution[i + 1]
      return next !== undefined
        ? sum +
            (next === "z"
              ? dis[item][next]
              : dis[item][reverseCasing(next)] + 1)
        : sum
    }, 0),
  )

  return Math.min(...solutionsDistances)
}

/* Results */

const input = readInput()

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA) // -> 618
console.log("Solution to part 2:", resultB) // -> 7152
