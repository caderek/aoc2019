import { test, readInput } from "../utils"

const rawInput = readInput()

const prepareInput = (rawInput) =>
  rawInput.split("\n").map((x) =>
    x.split(",").map((item) => ({
      direction: item.slice(0, 1),
      distance: item.slice(1),
    })),
  )

const input = prepareInput(rawInput)

const findIntersections = (paths) => {
  const [a, b] = paths

  const intersections = []

  a.forEach((x) => {
    const y = b.find((y, i) => x[0] === y[0] && x[1] === y[1])
    if (y !== undefined) {
      intersections.push([x[0], x[1], x[2], y[2]])
    }
  })

  return intersections
}

const findNearestCross = (paths) => {
  const intersections = findIntersections(paths)

  return Math.min(
    ...intersections.map((item) => {
      return Math.abs(item[0]) + Math.abs(item[1])
    }),
  )
}

const getPaths = (input) => {
  return input.map((wire) => {
    let steps = 0
    let x = 0
    let y = 0
    let path = []

    wire.forEach(({ direction, distance }) => {
      path = path.concat(
        Array.from({ length: distance }, () => [
          direction === "R" ? ++x : direction === "L" ? --x : x,
          direction === "U" ? ++y : direction === "D" ? --y : y,
          ++steps,
        ]),
      )
    })

    return path
  })
}

const goA = (input) => {
  return findNearestCross(getPaths(input))
}

const goB = (input) => {
  const paths = getPaths(input)
  const intersections = findIntersections(paths)

  return Math.min(...intersections.map((x) => x[2] + x[3]))
}

/* Tests */

test(
  goA(
    prepareInput(
      "R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83",
    ),
  ),
  159,
)
test(
  goA(
    prepareInput(
      "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7",
    ),
  ),
  135,
)

test(
  goB(
    prepareInput(
      "R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83",
    ),
  ),
  610,
)
test(
  goB(
    prepareInput(
      "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7",
    ),
  ),
  410,
)

/* Results */

console.log("Solution to part 1:", goA(prepareInput(rawInput))) // -> 256

console.log("Solution to part 2:", goB(prepareInput(rawInput))) // -> 12304
