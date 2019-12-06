[(G=require("graphlib")),require("fs").readFileSync(`./input.txt`).toString()
.split("\n").reduce((g,x)=>g.setEdge(...x.split(")")),new G.Graph())].reduce(
(G,g)=>console.log(Object.values(G.alg.dijkstra(g,"COM")).reduce((x,n)=>x+n
.distance,0),G.alg.dijkstra(g,"YOU",null,g.nodeEdges.bind(g)).SAN.distance-2))
