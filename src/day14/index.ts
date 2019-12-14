// @ts-nocheck
import {
  test,
  readInput,
  arr,
  com,
  mul,
  dis,
  math,
  iter,
  R,
  graph,
} from "../utils/index"
import { split } from "ramda"
const prepareInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((formula) =>
      formula
        .split("=>")
        .reverse()
        .map((x) => x.trim()),
    )
    .map(([prod, sub]) => {
      const [prodAmount, prodName] = prod.split(" ")
      const subtracts = sub
        .split(", ")
        .map((subtract) => subtract.split(" ").reverse())
        .map(([name, amount]) => [name, Number(amount)])
      // .chain(Object.fromEntries)

      return [prodName, { amount: Number(prodAmount), subtracts }]
    })
    // .chain(arr.append_(["ORE", 1]))
    .chain(Object.fromEntries)

const getOre = (input, chemical, required) => {
  if (chemical === "ORE") {
    return 1
  }

  const recipe = input[chemical]

  const req = Math.ceil(required / recipe.amount)

  return (
    recipe.amount *
    recipe.subtracts
      .map(([name, amount]) => getOre(input, name, amount))
      .reduce((a, b) => a + b) *
    required
  )
}

const goA = (rawInput: string) => {
  const input = prepareInput(rawInput)

  console.dir(input, { colors: true, depth: 99 })

  const x = 1

  console.dir(x, { colors: true, depth: 99 })

  return getOre(input, "FUEL", 1)
}

const goB = (rawInput: string) => {
  const input = prepareInput(rawInput)

  return
}

/* Tests */

test(
  goA(
    `
9 ORE => 2 A
8 ORE => 3 B
7 ORE => 5 C
3 A, 4 B => 1 AB
5 B, 7 C => 1 BC
4 C, 1 A => 1 CA
2 AB, 3 BC, 4 CA => 1 FUEL
`.trim(),
  ),
  165,
)

// test(
//   goA(
//     `
// 157 ORE => 5 NZVS
// 165 ORE => 6 DCFZ
// 44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
// 12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
// 179 ORE => 7 PSHF
// 177 ORE => 5 HKGWZ
// 7 DCFZ, 7 PSHF => 2 XJWVT
// 165 ORE => 2 GPVTF
// 3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT
// `.trim(),
//   ),
//   13312,
// )

// test(
//   goA(
//     `
// 2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
// 17 NVRVD, 3 JNWZP => 8 VPVL
// 53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
// 22 VJHF, 37 MNCFX => 5 FWMGM
// 139 ORE => 4 NVRVD
// 144 ORE => 7 JNWZP
// 5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
// 5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
// 145 ORE => 6 MNCFX
// 1 NVRVD => 8 CXFTF
// 1 VJHF, 6 MNCFX => 4 RFSQX
// 176 ORE => 6 VJHF
// `.trim(),
//   ),
//   180697,
// )

// test(
//   goA(
//     `
// 171 ORE => 8 CNZTR
// 7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
// 114 ORE => 4 BHXH
// 14 VRPVC => 6 BMBT
// 6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
// 6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
// 15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
// 13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
// 5 BMBT => 4 WPTQ
// 189 ORE => 9 KTJDG
// 1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
// 12 VRPVC, 27 CNZTR => 2 XDBXC
// 15 KTJDG, 12 BHXH => 5 XCVML
// 3 BHXH, 2 VRPVC => 7 MZWV
// 121 ORE => 7 VRPVC
// 7 XCVML => 6 RJRHP
// 5 BHXH, 4 VRPVC => 5 LTCX
// `.trim(),
//   ),
//   2210736,
// )

// // test(goB(""), )
// // test(goB(""), )

// /* Results */

// const input = readInput()

// console.time("Time")
// const resultA = goA(input)
// const resultB = goB(input)
// console.timeEnd("Time")

// console.log("Solution to part 1:", resultA)
// console.log("Solution to part 2:", resultB)
