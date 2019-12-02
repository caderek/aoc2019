import { isDeepStrictEqual } from "util"
import * as kleur from "kleur"

let index = 0

export const test = (a: any, b: any) => {
  const passed = isDeepStrictEqual(a, b)

  if (passed) {
    console.log(kleur.green(`${index}: passed`))
  } else {
    console.log(kleur.gray("-----------------------------------------"))
    console.log(kleur.red(`${index}: failed:\n\nResult: ${a}\nExpected: ${b}`))
    console.log(kleur.gray("-----------------------------------------"))
  }

  index++
}
