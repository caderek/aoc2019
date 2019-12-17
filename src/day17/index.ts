import { readInput, delay } from "../utils/index"
import compute, { unblock } from "./computer"

enum ASCII {
  A = "A".charCodeAt(0),
  B = "B".charCodeAt(0),
  C = "C".charCodeAt(0),
  COMMA = ",".charCodeAt(0),
  NEW_LINE = "\n".charCodeAt(0),
  SCAFFOLD = "#".charCodeAt(0),
  EMPTY = ".".charCodeAt(0),
  LEFT = "L".charCodeAt(0),
  RIGHT = "R".charCodeAt(0),
  YES = "y".charCodeAt(0),
  NO = "n".charCodeAt(0),
  UP_ARROW = "^".charCodeAt(0),
  DOWN_ARROW = "v".charCodeAt(0),
  LEFT_ARROW = "<".charCodeAt(0),
  RIGHT_ARROW = ">".charCodeAt(0),
  ZERO = "0".charCodeAt(0),
  ONE = "1".charCodeAt(0),
  TWO = "2".charCodeAt(0),
  THREE = "3".charCodeAt(0),
  FOUR = "4".charCodeAt(0),
  FIVE = "5".charCodeAt(0),
  SIX = "6".charCodeAt(0),
  SEVEN = "7".charCodeAt(0),
  EIGHT = "8".charCodeAt(0),
  NINE = "9".charCodeAt(0),
}

const goA = async (source: string) => {
  const inputs = []
  const outputs = []

  const out = await compute(source, inputs, outputs)

  const points = [[]]

  out.forEach((item) => {
    if (item === 10) {
      points.push([])
    } else if (item < 256) {
      points[points.length - 1].push(`${String.fromCharCode(item)} `)
    } else {
      points[points.length - 1].push("? ")
    }
  })

  const map = points.map((x) => x.join("")).join("\n")

  // console.log(map)

  const result =
    36 * 6 +
    40 * 10 +
    46 * 10 +
    22 * 12 +
    28 * 14 +
    48 * 18 +
    24 * 18 +
    44 * 22 +
    32 * 26 +
    26 * 26 +
    44 * 28 +
    36 * 30

  return result
}

/* My "computations" for part two:

R10 L12 R06 R10 L12 R06 R06 R10 R12 R06 R10 L12 L12 R06 R10 R12 R06
R10 L12 L12 R06 R10 R12 R06 R10 L12 L12 R06 R10 R12 R06 R10 L12 R06

D E F D E F F D G F D E E F D G F D E E F D G F D E E F D G F D E F

D E F | D E F | F D G F | D E E | F D G F | D E E | F D G F | D E E | F D G F | D E F
A     | A     | B       | C     | B       | C     | B       | C     | B       | A

*/

const functions = [
  ASCII.A,
  ASCII.COMMA,
  ASCII.A,
  ASCII.COMMA,
  ASCII.B,
  ASCII.COMMA,
  ASCII.C,
  ASCII.COMMA,
  ASCII.B,
  ASCII.COMMA,
  ASCII.C,
  ASCII.COMMA,
  ASCII.B,
  ASCII.COMMA,
  ASCII.C,
  ASCII.COMMA,
  ASCII.B,
  ASCII.COMMA,
  ASCII.A,
  ASCII.NEW_LINE,
]

const definitions = [
  [
    ASCII.RIGHT,
    ASCII.COMMA,
    ASCII.ONE,
    ASCII.ZERO,
    ASCII.COMMA,
    ASCII.LEFT,
    ASCII.COMMA,
    ASCII.ONE,
    ASCII.TWO,
    ASCII.COMMA,
    ASCII.RIGHT,
    ASCII.COMMA,
    ASCII.SIX,
    ASCII.NEW_LINE,
  ],
  [
    ASCII.RIGHT,
    ASCII.COMMA,
    ASCII.SIX,
    ASCII.COMMA,
    ASCII.RIGHT,
    ASCII.COMMA,
    ASCII.ONE,
    ASCII.ZERO,
    ASCII.COMMA,
    ASCII.RIGHT,
    ASCII.COMMA,
    ASCII.ONE,
    ASCII.TWO,
    ASCII.COMMA,
    ASCII.RIGHT,
    ASCII.COMMA,
    ASCII.SIX,
    ASCII.NEW_LINE,
  ],
  [
    ASCII.RIGHT,
    ASCII.COMMA,
    ASCII.ONE,
    ASCII.ZERO,
    ASCII.COMMA,
    ASCII.LEFT,
    ASCII.COMMA,
    ASCII.ONE,
    ASCII.TWO,
    ASCII.COMMA,
    ASCII.LEFT,
    ASCII.COMMA,
    ASCII.ONE,
    ASCII.TWO,
    ASCII.NEW_LINE,
  ],
]

const continuosFeed = [ASCII.NO, ASCII.NEW_LINE]

const commands = [functions, ...definitions, continuosFeed]

const goB = async (source: string) => {
  const inputs = []
  const outputs = []
  const modifiedSource = "2" + source.slice(1)
  let done = false
  let result: number

  compute(modifiedSource, inputs, outputs).then(() => (done = true))

  while (!done) {
    if (outputs.length === 0) {
      await unblock()
    }

    let out = []

    while (outputs.length !== 0) {
      out.push(outputs.shift())
    }

    const points = [[]]

    out.forEach((item) => {
      if (item === 10) {
        points.push([])
      } else if (item < 256) {
        points[points.length - 1].push(`${String.fromCharCode(item)} `)
      } else {
        result = item
      }
    })

    const screen = points.map((x) => x.join("")).join("\n")

    // console.log(screen)
    // await delay(500)

    if (commands.length !== 0) {
      commands.shift().forEach((char) => inputs.push(char))
    }
  }

  return result
}

/* Results */

const main = async () => {
  const input = readInput()

  console.time("Time")
  const resultA = await goA(input)
  const resultB = await goB(input)
  console.timeEnd("Time")

  console.log("Solution to part 1:", resultA) // -> 7816
  console.log("Solution to part 2:", resultB) // -> 952010
}

main()
