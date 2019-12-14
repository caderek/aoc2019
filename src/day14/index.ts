import { test, readInput } from "../utils/index"

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
      const substrates = sub
        .split(", ")
        .map((substrate) => substrate.split(" ").reverse())
        .map(([name, amount]) => [name, Number(amount)])

      return [prodName, { minAmount: Number(prodAmount), substrates }]
    })
    .chain(Object.fromEntries)

const calcDepth = (reaction, input) => {
  const sub = reaction.substrates

  return sub.length === 1 && sub[0][0] === "ORE"
    ? 1
    : 1 + Math.max(...sub.map(([name]) => calcDepth(input[name], input)))
}

const calcDepths = (input) => {
  const depths: Map<number, string[]> = new Map()

  for (const key in input) {
    const depth = calcDepth(input[key], input)
    const items = depths.get(depth)
    depths.set(depth, items === undefined ? [key] : [...items, key])
  }

  const maxDepth = Math.max(...depths.keys())

  return [depths, maxDepth]
}

const calcOre = (items, depths, maxDepth) => {
  let fuel = items.FUEL

  for (let i = maxDepth - 1; i > 0; i--) {
    fuel.substrates = fuel.substrates
      .map(([name, minAmount]) => {
        if (depths.get(i).includes(name)) {
          return items[name].substrates.map(([n, a]) => {
            const parentMinAmount = items[name].minAmount
            return [n, a * Math.ceil(minAmount / parentMinAmount)]
          })
        }

        return [[name, minAmount]]
      })
      .flat()
      .chain((arr: [string, number][]) => {
        const merged = []
        arr.forEach((item) => {
          const index = merged.findIndex((x) => x[0] === item[0])

          if (index !== -1) {
            merged[index][1] += item[1]
          } else {
            merged.push(item)
          }
        })

        return merged
      })
  }

  return fuel.substrates.flat()[1]
}

const prepareAlteredInput = (input, fuelSubstrates) => (units) => {
  input.FUEL.substrates = fuelSubstrates.map(([name, amount]) => [
    name,
    amount * units,
  ])
}

const goA = (rawInput: string) => {
  const input = prepareInput(rawInput)
  const [depths, maxDepth] = calcDepths(input)

  return calcOre(input, depths, maxDepth)
}

const goB = (rawInput: string) => {
  const input = prepareInput(rawInput)
  const fuelSubstrates = JSON.parse(JSON.stringify(input.FUEL.substrates))
  const [depths, maxDepth] = calcDepths(input)

  const attempt = prepareAlteredInput(input, fuelSubstrates)

  let target = 1000000000000

  const perUnit = calcOre(input, depths, maxDepth)

  let min = Math.floor(target / perUnit)
  let max = 2 * min

  while (true) {
    let units = Math.round((min + max) / 2)

    attempt(units)
    const totalOre = calcOre(input, depths, maxDepth)

    if (totalOre === target) {
      return units
    }

    attempt(units + 1)
    const totalOrePlus = calcOre(input, depths, maxDepth)

    if (totalOre < target && totalOrePlus > target) {
      return units
    }

    if (totalOre < target) {
      min = units
    } else {
      max = units
    }
  }
}

/* Tests */

test(
  goA(
    `
10 ORE => 10 A
1 ORE => 1 B
7 A, 1 B => 1 C
7 A, 1 C => 1 D
7 A, 1 D => 1 E
7 A, 1 E => 1 FUEL
`.trim(),
  ),
  31,
)

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

test(
  goA(
    `
157 ORE => 5 NZVS
165 ORE => 6 DCFZ
44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
179 ORE => 7 PSHF
177 ORE => 5 HKGWZ
7 DCFZ, 7 PSHF => 2 XJWVT
165 ORE => 2 GPVTF
3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT
`.trim(),
  ),
  13312,
)

test(
  goA(
    `
2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
17 NVRVD, 3 JNWZP => 8 VPVL
53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
22 VJHF, 37 MNCFX => 5 FWMGM
139 ORE => 4 NVRVD
144 ORE => 7 JNWZP
5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
145 ORE => 6 MNCFX
1 NVRVD => 8 CXFTF
1 VJHF, 6 MNCFX => 4 RFSQX
176 ORE => 6 VJHF
`.trim(),
  ),
  180697,
)

test(
  goA(
    `
171 ORE => 8 CNZTR
7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
114 ORE => 4 BHXH
14 VRPVC => 6 BMBT
6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
5 BMBT => 4 WPTQ
189 ORE => 9 KTJDG
1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
12 VRPVC, 27 CNZTR => 2 XDBXC
15 KTJDG, 12 BHXH => 5 XCVML
3 BHXH, 2 VRPVC => 7 MZWV
121 ORE => 7 VRPVC
7 XCVML => 6 RJRHP
5 BHXH, 4 VRPVC => 5 LTCX
`.trim(),
  ),
  2210736,
)

test(
  goB(
    `
157 ORE => 5 NZVS
165 ORE => 6 DCFZ
44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
179 ORE => 7 PSHF
177 ORE => 5 HKGWZ
7 DCFZ, 7 PSHF => 2 XJWVT
165 ORE => 2 GPVTF
3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT
`.trim(),
  ),
  82892753,
)

test(
  goB(
    `
2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
17 NVRVD, 3 JNWZP => 8 VPVL
53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
22 VJHF, 37 MNCFX => 5 FWMGM
139 ORE => 4 NVRVD
144 ORE => 7 JNWZP
5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
145 ORE => 6 MNCFX
1 NVRVD => 8 CXFTF
1 VJHF, 6 MNCFX => 4 RFSQX
176 ORE => 6 VJHF
`.trim(),
  ),
  5586022,
)

test(
  goB(
    `
171 ORE => 8 CNZTR
7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
114 ORE => 4 BHXH
14 VRPVC => 6 BMBT
6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
5 BMBT => 4 WPTQ
189 ORE => 9 KTJDG
1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
12 VRPVC, 27 CNZTR => 2 XDBXC
15 KTJDG, 12 BHXH => 5 XCVML
3 BHXH, 2 VRPVC => 7 MZWV
121 ORE => 7 VRPVC
7 XCVML => 6 RJRHP
5 BHXH, 4 VRPVC => 5 LTCX
`.trim(),
  ),
  460664,
)

/* Results */

const input = readInput()

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA) // -> 751038
console.log("Solution to part 2:", resultB) // -> 2074843
