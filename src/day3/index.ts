import { test, readInput } from "../utils"
import { pipe } from "@arrows/composition"

type Wire = { dir: "R" | "L" | "U" | "D"; dis: number }[]
type Wires = [Wire, Wire]
type XYSteps = [number, number, number]
type Paths = [XYSteps[], XYSteps[]]
type XYStepsAStepsB = [number, number, number, number]
type Intersections = XYStepsAStepsB[]

const rawInput = readInput()

const prepareInput = (rawInput: string) =>
  rawInput.split("\n").map((x) =>
    x.split(",").map((item) => ({
      dir: item.slice(0, 1),
      dis: Number(item.slice(1)),
    })),
  )

const input = prepareInput(rawInput)

const getPaths = (input: Wires) => {
  return input.map((wire) => {
    let steps = 0
    let x = 0
    let y = 0
    let path = []

    for (const { dir, dis } of wire) {
      path = path.concat(
        Array.from({ length: dis }, () => [
          dir === "R" ? ++x : dir === "L" ? --x : x,
          dir === "U" ? ++y : dir === "D" ? --y : y,
          ++steps,
        ]),
      )
    }

    return path
  })
}

const findIntersections = (paths: Paths) => {
  const [a, b] = paths

  const intersections = []

  for (const x of a) {
    const y = b.find((y) => x[0] === y[0] && x[1] === y[1])
    if (y !== undefined) {
      intersections.push([x[0], x[1], x[2], y[2]])
    }
  }

  return intersections
}

const findNearestCross = (intersections: Intersections) => {
  return Math.min(
    ...intersections.map((item) => {
      return Math.abs(item[0]) + Math.abs(item[1])
    }),
  )
}

const goA = (intersections: Intersections) => {
  return findNearestCross(intersections)
}

const goB = (intersections: Intersections) => {
  return Math.min(...intersections.map((x) => x[2] + x[3]))
}

/* Tests */

pipe.now(
  "R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83",
  prepareInput,
  getPaths,
  findIntersections,
  goA,
  test(159),
)

pipe.now(
  "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7",
  prepareInput,
  getPaths,
  findIntersections,
  goA,
  test(135),
)

pipe.now(
  "R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83",
  prepareInput,
  getPaths,
  findIntersections,
  goB,
  test(610),
)

pipe.now(
  "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7",
  prepareInput,
  getPaths,
  findIntersections,
  goB,
  test(410),
)

/* Results */

console.time("Time")
const intersections = pipe.now(input, getPaths, findIntersections)
const resultA = goA(intersections)
const resultB = goB(intersections)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA) // -> 258
console.log("Solution to part 2:", resultB) // -> 12304
