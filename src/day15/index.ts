import { readInput, graph } from "../utils/index"
import compute, { unblock } from "./computer"
import { draw, drawPaths, Waypoint } from "./render"

enum Command {
  NORTH = 1,
  SOUTH,
  WEST,
  EAST,
}

enum Status {
  WALL,
  MOVED,
  MOVED_TO_DESTINATION,
}

enum Clockwise {
  NORTH = Command.EAST,
  EAST = Command.SOUTH,
  SOUTH = Command.WEST,
  WEST = Command.NORTH,
}

enum Counterclockwise {
  NORTH = Command.WEST,
  WEST = Command.SOUTH,
  SOUTH = Command.EAST,
  EAST = Command.NORTH,
}

const getIncrements = (
  command: Command,
  currentX: number,
  currentY: number,
) => {
  let inc: [number, number]

  switch (command) {
    case Command.NORTH:
      inc = [0, -1]
      break
    case Command.SOUTH:
      inc = [0, 1]
      break
    case Command.WEST:
      inc = [-1, 0]
      break
    case Command.EAST:
      inc = [1, 0]
      break
  }
  return [currentX + inc[0], currentY + inc[1]]
}

const walk = (status, previousCommand) => {
  return status === Status.WALL
    ? Counterclockwise[Command[previousCommand]]
    : Clockwise[Command[previousCommand]]
}

const areNeighbors = (x1, x2, y1, y2) => {
  return (
    (x1 === x2 || y1 === y2) &&
    (Math.abs(x1 - x2) === 1 || Math.abs(y1 - y2) === 1)
  )
}

const goA = async (source: string) => {
  const inputs = []
  const outputs = []

  compute(source, inputs, outputs)

  const map = new Map([["0,0", [0, 0, Status.MOVED]]])
  let currentCommand: Command = Command.NORTH
  let currentX: number = 0
  let currentY: number = 0

  do {
    inputs.push(currentCommand)

    if (outputs.length === 0) {
      await unblock()
    }

    const status = outputs.shift()
    const [nextX, nextY] = getIncrements(currentCommand, currentX, currentY)
    const key = `${nextX},${nextY}`

    switch (status) {
      case Status.WALL: {
        map.set(key, [nextX, nextY, Status.WALL])
        break
      }
      case Status.MOVED: {
        map.set(key, [nextX, nextY, Status.MOVED])
        currentX = nextX
        currentY = nextY
        break
      }
      case Status.MOVED_TO_DESTINATION: {
        map.set(key, [nextX, nextY, Status.MOVED_TO_DESTINATION])
        currentX = nextX
        currentY = nextY
        break
      }
    }

    /* Uncomment the next line to draw the maze */
    // status === Status.MOVED && draw([...map.values()], [currentX, currentY])

    if (status === Status.MOVED && currentX === 0 && currentY === 0) {
      break
    }

    currentCommand = walk(status, currentCommand)
  } while (true)

  /* Path finding */

  const waypoints = [...map.values()]
    .filter(([_, __, id]) => id !== 0)
    .map(([x, y, id]) => [x, y, `${x},${y}`, id]) as Waypoint[]

  const g = new graph.Graph()

  waypoints.forEach(([x1, y1, tag1], i) => {
    const next = waypoints[i + 1]

    if (next === undefined) {
      return
    }

    const [x2, y2, tag2] = next

    const parentTag = areNeighbors(x1, x2, y1, y2)
      ? tag1
      : waypoints.find(([x, y]) => areNeighbors(x, x2, y, y2))[2]

    g.setEdge(parentTag, tag2)
  })

  const targetTag = waypoints.find((x) => x[3] === 2)[2]

  const distance = graph.alg.dijkstra(g, "0,0", null, g.nodeEdges.bind(g))[
    targetTag
  ].distance

  /* Uncomment the next line to draw the paths */
  // await drawPaths(g, targetTag, map)

  return { distance, targetTag, g }
}

const goB = async (tag: string, g: graph.Graph) => {
  const paths = graph.alg.dijkstra(g, tag, null, g.nodeEdges.bind(g))

  return Math.max(...Object.values(paths).map((x) => x.distance))
}

const main = async () => {
  /* Results */
  const input = readInput()

  console.time("Time")
  const resultA = await goA(input)
  const resultB = await goB(resultA.targetTag, resultA.g)
  console.timeEnd("Time")

  console.log("Solution to part 1:", resultA.distance) // -> 236
  console.log("Solution to part 2:", resultB) // -> 368
}

main()
