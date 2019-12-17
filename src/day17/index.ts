import { readInput, delay, graph, log, equal, arr } from "../utils/index"
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

  const points = out.reduce(
    (arr, item) => {
      item === 10
        ? arr.push([])
        : arr[arr.length - 1].push(`${String.fromCharCode(item)}`)

      return arr
    },
    [[]],
  )

  /* Uncomment the next two lines to render the map */
  // const map = points.map((x) => x.join("")).join("\n")
  // console.log(map)

  const scaffolding = points.flatMap((row, y) =>
    row.reduce((arr, char, x) => (char === "#" ? [...arr, [x, y]] : arr), []),
  )

  const answer = scaffolding
    .filter(
      ([x, y], _, arr) =>
        arr.find(equal([x, y - 1])) &&
        arr.find(equal([x, y + 1])) &&
        arr.find(equal([x - 1, y])) &&
        arr.find(equal([x + 1, y])),
    )
    .reduce((sum, [x, y]) => sum + x * y, 0)

  return { answer, points }
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

const findFunctions = (points) => {
  const items = points.flatMap((row, y) =>
    row.reduce((arr, char, x) => [...arr, [x, y, char]], []),
  )

  const scaffolding = items.filter((item) => item[2] === "#")
  const robot = items.find((item) => ["^", "v", ">", "<"].includes(item[2]))

  // log({ items, scaffolding, robot })
}

const goB = async (source: string) => {
  const modifiedSource = "2" + source.slice(1)
  const inputs = [...commands.flat()]
  const outputs = await compute(modifiedSource, inputs)

  return arr.last_(outputs)
}

/* Results */

const main = async () => {
  const input = readInput()

  console.time("Time")
  const resultA = await goA(input)
  const resultB = await goB(input)
  console.timeEnd("Time")

  findFunctions(resultA.points)

  console.log("Solution to part 1:", resultA.answer) // -> 7816
  console.log("Solution to part 2:", resultB) // -> 952010
}

main()
