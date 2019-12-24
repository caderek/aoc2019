import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) =>
  rawInput.split("\n").map((x) => x.split(""))

const goA = (rawInput: string) => {
  let eris = prepareInput(rawInput) as string[][]

  const hashes = new Set([String(eris)])

  while (true) {
    const next = Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => ""),
    )

    for (let y = 0; y < eris.length; y++) {
      for (let x = 0; x < eris.length; x++) {
        let neighbors = 0

        if (eris[y] && eris[y][x - 1] === "#") {
          neighbors++
        }
        if (eris[y] && eris[y][x + 1] === "#") {
          neighbors++
        }
        if (eris[y + 1] && eris[y + 1][x] === "#") {
          neighbors++
        }
        if (eris[y - 1] && eris[y - 1][x] === "#") {
          neighbors++
        }

        next[y][x] =
          (eris[y][x] === "#" && neighbors === 1) ||
          (eris[y][x] === "." && (neighbors === 1 || neighbors === 2))
            ? "#"
            : "."
      }
    }

    eris = next
    const hash = String(eris)

    if (hashes.has(hash)) {
      break
    } else {
      hashes.add(hash)
    }
  }

  return eris
    .flat()
    .reduce((sum, next, i) => sum + (next === "#" ? 2 ** i : 0), 0)
}

const isDeeperLevel = {
  left: (x, y) => x === 3 && y === 2,
  right: (x, y) => x === 1 && y === 2,
  top: (x, y) => y === 3 && x === 2,
  down: (x, y) => y === 1 && x === 2,
}

const isUpperLevel = {
  left: (x, y) => x === 0,
  right: (x, y) => x === 4,
  top: (x, y) => y === 0,
  down: (x, y) => y === 4,
}

const inc = {
  left: [0, -1],
  right: [0, 1],
  top: [-1, 0],
  down: [1, 0],
}

const getSide = (side, layer, layers, key, x, y) => {
  const deeper = isDeeperLevel[side](x, y)
  const upper = isUpperLevel[side](x, y)

  if (!deeper && !upper) {
    const [incY, incX] = inc[side]

    return layer[y + incY][x + incX] === "#" ? 1 : 0
  }

  if (deeper) {
    const l = layers[Number(key) + 1]
    if (l === undefined) {
      return 0
    }

    const res = {
      left: [l[0][4], l[1][4], l[2][4], l[3][4], l[4][4]],
      right: [l[0][0], l[1][0], l[2][0], l[3][0], l[4][0]],
      top: [l[4][0], l[4][1], l[4][2], l[4][3], l[4][4]],
      down: [l[0][0], l[0][1], l[0][2], l[0][3], l[0][4]],
    }[side].filter((x) => x === "#").length
    return res
  }

  if (upper) {
    const l = layers[Number(key) - 1]

    if (l === undefined) {
      return 0
    }

    return {
      left: l[2][1],
      right: l[2][3],
      top: l[1][2],
      down: l[3][2],
    }[side] === "#"
      ? 1
      : 0
  }
}

const goB = (rawInput: string, minutes = 200) => {
  const layer0 = prepareInput(rawInput)
  layer0[2][2] = "?"
  let layers = { 0: layer0 }
  let minute = 0

  while (minute < minutes) {
    layers[minute + 1] = Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => "."),
    )

    layers[minute + 1][2][2] = "?"

    layers[-(minute + 1)] = Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => "."),
    )

    layers[-(minute + 1)][2][2] = "?"

    const temp = JSON.parse(JSON.stringify(layers))

    for (const key in layers) {
      const layer = layers[key]
      const tempLayer = Array.from({ length: 5 }, () =>
        Array.from({ length: 5 }, () => "."),
      )

      for (let y = 0; y < layer.length; y++) {
        for (let x = 0; x < layer.length; x++) {
          if (x === 2 && y === 2) {
            tempLayer[y][x] = "?"
            continue
          }

          const neighbors =
            getSide("left", layer, layers, key, x, y) +
            getSide("right", layer, layers, key, x, y) +
            getSide("top", layer, layers, key, x, y) +
            getSide("down", layer, layers, key, x, y)

          tempLayer[y][x] =
            (layer[y][x] === "#" && neighbors === 1) ||
            (layer[y][x] === "." && (neighbors === 1 || neighbors === 2))
              ? "#"
              : "."
        }
      }
      temp[key] = tempLayer
    }

    layers = temp

    minute++
  }

  return Object.values(layers)
    .flat(2)
    .filter((x) => x === "#").length
}

/* Tests */

const exampleA = `
.....
.....
.....
#....
.#...
`.trim()

const exampleB = `
....#
#..#.
#.?##
..#..
#....
`.trim()

test(goA(exampleA), 2129920)

test(goB(exampleB, 10), 99)

/* Results */

const input = readInput()

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA) // -> 23846449
console.log("Solution to part 2:", resultB) // -> 1934
