type Calc = (num: number) => number

const calculateFuelMass: Calc = (moduleWeight) => {
  return Math.floor(moduleWeight / 3) - 2
}

const calculateCorrectFuelMass: Calc = (moduleWeight) => {
  const mass = calculateFuelMass(moduleWeight)
  return mass > 0 ? mass + calculateCorrectFuelMass(mass) : 0
}

const calculateTotalFuelMass = (input: number[], calculate: Calc) => {
  return input.reduce((a, b) => a + calculate(b), 0)
}

export { calculateFuelMass, calculateCorrectFuelMass, calculateTotalFuelMass }
