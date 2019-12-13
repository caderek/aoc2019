import * as math from "mathjs"
import { test, readInput } from "../utils/index"

type Coord = number
type Velocity = number
type Axis = [Coord, Velocity][]
type Axes = Axis[]

const flip = (arr: any[]) => arr[0].map((_, i) => arr.map((row) => row[i]))

const prepareInput = (rawInput: string) => {
  const moons = rawInput.split("\n").map((moon) =>
    moon
      .slice(1, -1)
      .split(", ")
      .map((coord) => Number(coord.slice(2))),
  )

  const axes = [[], [], []]

  for (const [x, y, z] of moons) {
    axes[0].push([x, 0])
    axes[1].push([y, 0])
    axes[2].push([z, 0])
  }

  return axes as Axes
}

const calcTotalEnergy = (axes: Axes) => {
  return flip(axes)
    .map(
      ([x, y, z]) =>
        (Math.abs(x[0]) + Math.abs(y[0]) + Math.abs(z[0])) *
        (Math.abs(x[1]) + Math.abs(y[1]) + Math.abs(z[1])),
    )
    .reduce((a, b) => a + b)
}

const getDiff = (axis: Axis, a: number, b: number) => {
  return axis[a][0] > axis[b][0] ? -1 : axis[a][0] < axis[b][0] ? 1 : 0
}

const calcStep = (axis: Axis) => {
  const combinations = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ]

  for (const [a, b] of combinations) {
    const diff = getDiff(axis, a, b)

    axis[a][1] += diff
    axis[b][1] += -diff
  }

  axis.forEach((_, index) => {
    axis[index][0] += axis[index][1]
  })

  return axis
}

const goA = (rawInput: string, stepsNum: number) => {
  const axes = prepareInput(rawInput)
  const lastStep = []

  axes.forEach((axis) => {
    let previousStep = axis

    for (let i = 1; i <= stepsNum; i++) {
      const step = calcStep(previousStep)

      if (i === stepsNum) {
        lastStep.push(step)
      }
      previousStep = step
    }
  })

  return calcTotalEnergy(lastStep)
}

const hash = (item) => `${item}`

const goB = (rawInput: string) => {
  const axes = prepareInput(rawInput)
  const cycles = []

  axes.forEach((axis) => {
    let previousStep = axis
    let counter = 0
    const h1 = hash(axis)

    while (true) {
      counter++
      const step = calcStep(previousStep)
      const h = hash(step)

      if (h === h1) {
        cycles.push(counter)
        break
      }
      previousStep = step
    }
  })

  // @ts-ignore
  return math.lcm(...cycles)
}

/* Tests */

test(
  goA(
    `
<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>
`.trim(),
    10,
  ),
  179,
)

test(
  goB(
    `
<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>
`.trim(),
  ),
  2772,
)

/* Results */

const input = readInput()

console.time("Time")
const resultA = goA(input, 1000)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA) // -> 14809
console.log("Solution to part 2:", resultB) // -> 282270365571288
