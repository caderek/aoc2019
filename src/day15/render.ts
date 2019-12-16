import logUpdate from "log-update"
import * as kleur from "kleur"

const randomColor = () =>
  ["green", "cyan", "blue"][Math.floor(Math.random() * 3)]

const tiles = {
  0: () => kleur[randomColor()]("\u2588\u2588"),
  1: kleur.blue("  "),
  2: kleur.yellow("\u2588\u2588"),
}

const draw = (data, droid) => {
  const minX = Math.abs(Math.min(...data.map((item) => item[0])))
  const minY = Math.abs(Math.min(...data.map((item) => item[1])))

  const grid = []

  data.forEach(([x, y, id]) => {
    if (!grid[y + minY]) {
      grid[y + minY] = []
    }
    grid[y + minY][x + minX] = id
  })

  const maxWidth = Math.max(...grid.map((row) => row.length))

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < maxWidth; col++) {
      if (grid[row][col] === undefined) {
        grid[row][col] =
          droid[0] === 0 && droid[1] === 0 ? tiles[0]() : kleur.gray("??")
      } else {
        grid[row][col] =
          typeof tiles[grid[row][col]] === "function"
            ? tiles[grid[row][col]]()
            : tiles[grid[row][col]]
      }
    }
  }

  grid[droid[1] + minY][droid[0] + minX] = kleur.red("\u2588\u2588")

  const render = grid.map((row) => row.join("")).join("\n")

  logUpdate(`\n${render}\n`)
}

export { draw }
