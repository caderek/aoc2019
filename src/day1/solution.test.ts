import {
  calculateFuelMass,
  calculateCorrectFuelMass,
  calculateTotalFuelMass,
} from "./solution"

describe("calculate fuel mass", () => {
  it("returns proper values", () => {
    expect(calculateFuelMass(12)).toBe(2)
    expect(calculateFuelMass(14)).toBe(2)
    expect(calculateFuelMass(1969)).toBe(654)
    expect(calculateFuelMass(100756)).toBe(33583)
  })
})

describe("calculate correct fuel mass", () => {
  it("returns proper values", () => {
    expect(calculateCorrectFuelMass(14)).toBe(2)
    expect(calculateCorrectFuelMass(1969)).toBe(966)
    expect(calculateCorrectFuelMass(100756)).toBe(50346)
  })
})

describe("calculate total fuel mass", () => {
  it("returns proper values", () => {
    expect(
      calculateTotalFuelMass([12, 14, 1969, 100756], calculateFuelMass),
    ).toBe(2 + 2 + 654 + 33583)
  })

  it("returns proper values (with correction)", () => {
    expect(
      calculateTotalFuelMass([14, 1969, 100756], calculateCorrectFuelMass),
    ).toBe(2 + 966 + 50346)
  })
})
