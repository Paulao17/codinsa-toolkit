// Finds the number of paths from node A to node B using the graph adjacency list.
let matrice = {};

matrice.countPaths = (graph, A, B) => {
  let stack = [ A ];
  let paths = 0;

  while (stack.length > 0) {
    const current = stack.pop();
    if (current === B) paths++;
    for (let neighbor of graph[current]) {
      stack.push(neighbor);
    }
  }
  return paths;
}

