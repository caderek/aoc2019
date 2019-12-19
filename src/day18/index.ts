import { readInput, graph, log } from "../utils/index"

const prepareInput = (rawInput: string) =>
  rawInput.split("\n").map((row) => row.split(""))

const getDistances = (tiles) => {
  const g = new graph.Graph({ directed: false })

  const maze: { [key: string]: [string, number, number] } = {}
  const waypoints: { [key: string]: string } = {}

  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[0].length; x++) {
      if (tiles[y][x] !== "#") {
        const tag = `${x},${y}`

        maze[`${x},${y}`] = [tiles[y][x], x, y]

        if (tiles[y][x] !== ".") {
          waypoints[tag] = tiles[y][x]
        }
      }
    }
  }

  Object.entries(maze).forEach(([tag, [id, x, y]]) => {
    g.setNode(tag, id)

    const upTag = `${x},${y - 1}`
    const downTag = `${x},${y + 1}`
    const leftTag = `${x - 1},${y}`
    const rightTag = `${x + 1},${y}`

    g.setNode(tag, id)

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

  const distances = Object.keys(waypoints).map((startTag) => {
    return [
      waypoints[startTag],
      Object.fromEntries(
        Object.entries(
          graph.alg.dijkstra(g, startTag, null, g.nodeEdges.bind(g)),
        )
          .filter(([tag, info]) => waypoints[tag] && info.distance !== Infinity)
          .map(([tag, info]) => [waypoints[tag], info.distance])
          // @ts-ignore
          .sort(([_, a], [__, b]) => a - b),
      ),
    ]
  })

  return Object.fromEntries(distances)
}

const goA = (rawInput: string) => {
  const tiles = prepareInput(rawInput)
  const dis = getDistances(tiles)

  /* Order (solved manually): a o q y g s i x u r e f d h v w b c z l n p j t k m */

  return (
    dis["@"].a +
    dis.a.o +
    dis.o.q +
    dis.q.y +
    dis.y.g +
    dis.g.s +
    dis.s.i +
    dis.i.x +
    dis.x.u +
    dis.u.r +
    dis.r.e +
    dis.e.f +
    dis.f.d +
    dis.d.h +
    dis.h.v +
    dis.v.w +
    dis.w.b +
    dis.b.c +
    dis.c.z +
    dis.z.l +
    dis.l.n +
    dis.n.p +
    dis.p.j +
    dis.j.t +
    dis.t.k +
    dis.k.m
  )
}

const goB = (rawInput: string) => {
  const tiles = prepareInput(rawInput)

  tiles[40][40] = "#"
  tiles[40][39] = "#"
  tiles[40][41] = "#"
  tiles[39][40] = "#"
  tiles[41][40] = "#"
  tiles[39][39] = "1"
  tiles[39][41] = "2"
  tiles[41][41] = "3"
  tiles[41][39] = "4"

  const dis = getDistances(tiles)

  /* Order (solved manually): g s i x u r e a o q y h v f d w b c z l n p j t k m */

  return (
    dis[4].g +
    dis.g.s +
    dis.s.i +
    dis.i.x +
    dis.x.u +
    dis.u.r +
    dis.r.e +
    dis[1].a +
    dis.a.o +
    dis.o.q +
    dis.q.y +
    dis[2].h +
    dis.h.v +
    dis[3].f +
    dis.f.d +
    dis.v.w +
    dis.w.b +
    dis.b.c +
    dis.d.z +
    dis.y.l +
    dis.c.n +
    dis.n.p +
    dis.p.j +
    dis.j.t +
    dis.t.k +
    dis.k.m
  )
}

/* Results */

const input = readInput()

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA) // -> 4246
console.log("Solution to part 2:", resultB) // -> 1940
