import { isDeepStrictEqual } from "util"
import * as kleur from "kleur"

let index = 0

export const test = (a: any, b: any) => {
  const passed = isDeepStrictEqual(a, b)

  console.log(kleur.gray("-----------------------------------------"))
  console.log(
    passed
      ? kleur.green(`${index}: passed`)
      : kleur.red(`${index}: failed:\n\nResult: ${a}\nExpected: ${b}`),
  )
  console.log(kleur.gray("-----------------------------------------"))

  index++
}
