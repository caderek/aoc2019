# 🎄 Advent of Code 2019 - Day 06 🎄

## Puzzle content

https://adventofcode.com/2019/day/6

## Bonus - code golf solution

```js
// prettier-ignore
;G=require("graphlib"),[require("fs").readFileSync(`./input.txt`).toString()
.split("\n").reduce((g,x)=>g.setEdge(...x.split(")")),new G.Graph())].map(
g=>console.log(Object.values(G.alg.dijkstra(g,"COM")).reduce((x,n)=>x+n
.distance,0),G.alg.dijkstra(g,"YOU",null,g.nodeEdges.bind(g)).SAN.distance-2))
```
