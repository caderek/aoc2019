import "./monkey"
import { test } from "./test"
import { readInput } from "./readInput"
import { arr, com, mul, dis } from "@arrows/arrows"
import * as math from "mathjs"
import * as R from "ramda"
import * as graph from "graphlib"
import { isDeepStrictEqual } from "util"
import * as gen from "generatorics"

const log = (data) => console.dir(data, { colors: true, depth: 99 })
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const equal = com.curry(isDeepStrictEqual)

export {
  test,
  readInput,
  arr,
  com,
  mul,
  dis,
  math,
  R,
  graph,
  log,
  delay,
  equal,
  gen,
}
export default { test, readInput }
