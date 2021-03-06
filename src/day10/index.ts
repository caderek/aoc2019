import * as R from "ramda"
import { test, readInput } from "../utils/index"

type Asteroid = [number, number]
enum Half {
  RIGHT,
  LEFT,
}

const prepareInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .flatMap((row, y) =>
      row.split("").map((item, x) => (item === "#" ? [x, y] : null)),
    )
    .filter((x) => x !== null)

const whichHalf = (x: number) => (x >= 0 ? Half.RIGHT : Half.LEFT)

const getRelativeAsteroids = (X: number, Y: number, asteroids: Asteroid[]) =>
  asteroids
    .filter(([x, y]) => x !== X || y !== Y)
    .map(([x, y]) => [x - X, y - Y])
    .map(([x, y]) => [x, y, y / x, whichHalf(x)])

const goA = (rawInput: string) => {
  const asteroids = prepareInput(rawInput) as Asteroid[]

  const visibleByCords = asteroids.map(([X, Y]) => {
    return {
      cords: [X, Y],
      visible: R.uniqWith(
        (a, b) => a[2] === b[2] && a[3] === b[3],
        getRelativeAsteroids(X, Y, asteroids),
      ).length,
    }
  })

  const max = Math.max(...visibleByCords.map((a) => a.visible))
  const cords = visibleByCords.find((a) => a.visible === max).cords

  return { max, cords }
}

const goB = (rawInput: string, [X, Y]: number[]) => {
  const asteroids = prepareInput(rawInput) as Asteroid[]
  const relativeAsteroids = getRelativeAsteroids(X, Y, asteroids).sort(
    ([x1, y1, r1, h1], [x2, y2, r2, h2]) => h1 - h2 || r1 - r2,
  )

  const grouped = new Map()

  relativeAsteroids.forEach(([x, y, ratio, half]) => {
    const key = `${ratio}:${half}`
    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.set(key, [[x + X, y + Y], ...grouped.get(key)])
  })

  const groupedValues = [...grouped.values()]
  const destroyed: Asteroid[] = []

  while (destroyed.length < 200) {
    groupedValues.forEach((series) => {
      const item = series.shift()
      if (item) {
        destroyed.push(item)
      }
    })
  }

  return destroyed[199][0] * 100 + destroyed[199][1]
}

/* Tests */

test(
  goA(
    `
.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##
`.trim(),
  ).max,
  210,
)

test(
  goA(
    `
.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..
`.trim(),
  ).max,
  41,
)

test(
  goA(
    `
#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.
`.trim(),
  ).max,
  35,
)

test(
  goA(
    `
......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####
`.trim(),
  ).max,
  33,
)

test(
  goB(
    `
.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##
`.trim(),
    [11, 13],
  ),
  802,
)

/* Results */

const input = readInput()

console.time("Time")
const resultA = goA(input)
const resultB = goB(input, resultA.cords)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA.max) // -> 214
console.log("Solution to part 2:", resultB) // -> 502
