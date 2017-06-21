function toRadians(degree) {
    return Math.PI*(degree/180);
}

function geographicalDistance(coord1, coord2) {
    earthRadius = 6371000;
    rad1 = [toRadians(coord1[0]), toRadians(coord1[1])];
    rad2 = [toRadians(coord2[0]), toRadians(coord2[1])];
    delta = [toRadians(coord2[0] - coord1[0]), toRadians(coord2[1] - coord1[1])];

    a = Math.sin(delta[0]/2) * Math.sin(delta[0]/2) + Math.cos(rad1[0]) * Math.cos(rad2[0]) * Math.sin(delta[1]/2) * Math.sin(delta[1]/2);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return earthRadius*c;
}

function findGoodPath(adjs, matching, prices, vertex) {
    var tree = [];
    var path = [];
    var visited = {};
    var parents = {}
    var edges = []
    var vertexes = []
    var minEdges = []
    var delta;
    parents[vertex] = undefined;

    delta = bdf(adjs, matching, prices, tree, visited, path, vertex, parents, edges, minEdges);

    while (path.length == 0) {
        for (var i = 0; i < minEdges.length; i++) {
            if (visited[minEdges[i][0]] === undefined) {
                steps.push([nodes[minEdges[i][0]], '#606', 3]);
                vertexes.push(minEdges[i][0]);
            }
        }

        minEdges = [];
        updatePrices(tree, prices, delta);
        delta = bdf(adjs, matching, prices, tree, visited, path, vertex, parents, edges, minEdges);
    }

    for (var i =0; i < minEdges.length; i++) {
        steps.push([nodes[minEdges[i][0]], nodes[minEdges[i][0]].color, 3]);
    }

    for (var i = 0; i < vertexes.length; i++) {
        steps.push([nodes[vertexes[i]], nodes[vertexes[i]].color, 3]);
    }

    for (var i = 0; i < edges.length; i++) {
        var edge = edges[i];
        var ee;

        if (edge[0] < m) {
            ee = e[edge[0]*n + edge[1] - m];
        } else {
            ee = e[edge[1]*n + edge[0] - m];
        }

        if (edge[0] in matching && matching[edge[0]] === edge[1]) {
            steps.push([ee, '#a00', 4]);
            ee.lastColor = '#a00';
        } else {
            steps.push([ee, '#00a', 4]);
            ee.lastColor = '#00a';
        }
    }

    for (var v in visited) {
        if (v < m) {
            steps.push([nodes[v],'#600' , 3]);
        } else {
            steps.push([nodes[v],'#006' , 3]);
        }
    }

    return path;
}

function bdf(adjs, matching, prices, tree, visited, path, vertex, parents, edges, minEdges) {
    var q = [];
    var stop = false;
    var lastLevel = 2;
    var delta = Infinity;
    q.push([vertex, 0]);

    while (q.length > 0 && !stop) {
        var v, level;
        var item = q.shift();
        v = item[0];
        level = item[1];

        if (lastLevel === level + 1 && lastLevel < tree.length) {
            for (var i = 0; i < tree[lastLevel].length; i++) {
                var node = tree[lastLevel][i];
                q.push([node[0], lastLevel]);
            }

            lastLevel += 2;    
        }

        if (visited[v] === undefined) {
            if (tree.length <= level) {
                tree.push([[v, level]]);
            } else {
                tree[level].push([v, level]);
            }

            visited[v] = true;
            steps.push([nodes[v], '#660', 3]);
        }

        if (level % 2 == 1 && visited[matching[v]] === undefined) {
            q.push([matching[v], level + 1]);
            parents[matching[v]] = v;

            var type = 0;
            var edge = e[v*n + matching[v] - m];

            if (v < m) {
                edges.push([v, matching[v]]);
            } else {
                edge = e[matching[v]*n + v - m];
                edges.push([matching[v], v]);
            }

            if (edge.lastColor != '#ccc') {
                type = 4;
            }

            steps.push([edge, '#0a0', type]);

            continue;
        }

        for (var i = 0; i < adjs[v].length; i++) {
            var adj = adjs[v][i];
            cost = adj[1] - (prices[v] + prices[adj[2]]);

            if (visited[adj[2]] === undefined && cost >= 0.0000001) {
                if (cost < delta) {
                    delta = cost;

                    for (var j =0; j < minEdges.length; j++) {
                        steps.push([nodes[minEdges[j][0]], nodes[minEdges[j][0]].color, 3]);
                    }

                    minEdges.splice(0, minEdges.length);
                    minEdges.push([adj[2], level + 1]);
                    steps.push([nodes[adj[2]],'#060', 3]);
                } else if(cost === delta) {
                    minEdges.push([adj[2], level + 1]);
                    steps.push([nodes[adj[2]],'#060', 3]);
                }

                var edge;

                if (v < m) {
                    edge = e[v*n + adj[2] - m];
                } else {
                    edge = e[adj[2]*n + v - m];
                }
                

                if (edge.lastColor === '#ccc') {
                    steps.push([edge, '#0aa', 0]);
                    steps.push([edge, '', 2]);
                } else {
                    steps.push([edge, '#0aa', 3]);
                    steps.push([edge, edge.lastColor, 3]);
                }
            }

            if (visited[adj[2]] === undefined && cost <= 0.0000001) {
                parents[adj[2]] = v; 
            steps.push([nodes[adj[2]], nodes[adj[2]].color, 3]);

                var edge;
                var type = 0;

                if (v < m) {
                    edge = e[v*n + adj[2] - m];
                    edges.push([v, adj[2]]);
                } else {
                    edge = e[adj[2]*n + v - m];
                    edges.push([adj[2], v]);
                }

                if (edge.lastColor !== '#ccc') {
                    type = 4;
                }
                
                steps.push([edge, '#0a0', type]);
                edge.lastColor = '#0a0';

                if (!(adj[2] in matching)) {
                    son = adj[2];

                    
                    while (parents[son] != undefined) {
                        v = parents[son];
                        if (v < m) {
                            edge = e[v*n + son - m];
                        } else {
                            edge = e[son*n + v - m];
                        }

                        steps.push([edge, '#aa0', 4]);

                        path.push([parents[son], son]);
                        son = parents[son];
                    }

                    stop = true;
                    return 0;
                } else {
                    q.push([adj[2], level + 1]);
                }
            }
        }

        if (q.length === 0 && lastLevel < tree.length && lastLevel != level) {
            for (var i = 0; i < tree[lastLevel].length; i++) {
                var node = tree[lastLevel][i];
                q.push([node[0], lastLevel]);
            }

            lastLevel += 2;    
        }
    }

    return delta;
}

function updatePrices(tree, prices, delta) {
    for (var i = 0; i < tree.length; i++) {
        var t = tree[i];

        for (var j = 0; j < t.length; j++) {
            var node = t[j];

            if (node[1] % 2 == 0) {
                prices[node[0]] += delta;
            } else {
                prices[node[0]] -= delta;
            }

            steps.push([nodes[node[0]], prices[node[0]], 1]);
        }
    }
}

function updateMatching(matching, path) {
    newEdges = [];

    for (var i = 0; i < path.length; i++) {
        var edge = path[i];
        var ee;
        if (edge[0] in matching && edge[1] in matching) {
            delete matching[edge[0]];
            delete matching[edge[1]];
            
            if (edge[0] < m) {
                ee = e[edge[0]*n + edge[1] - m];
            } else {
                ee = e[edge[1]*n + edge[0] - m];
            }

            steps.push([ee, '#00a', 4]);
            ee.lastColor = '#00a';
        } else {
            newEdges.push(edge);
        }
    }

    for (var i = 0; i < newEdges.length; i++) {
        var edge = newEdges[i];
        var ee;
        matching[edge[0]] = edge[1];
        matching[edge[1]] = edge[0];

        if (edge[0] < m) {
            ee = e[edge[0]*n + edge[1] - m];
        } else {
            ee = e[edge[1]*n + edge[0] - m];
        }

        steps.push([ee, '#a00', 4]);
        ee.lastColor = '#a00';
    }
}

function mountGraph(cargos, trucks, prices, adjs, edges) {
    n = trucks.length;
    m = cargos.length;
    cCounter = 0;

    for (var i = 0; i < m; i++) {
        var cargo = cargos[i];
        var min = Infinity;
        tCounter = m;
        edges.push([]);

        for (var j = 0; j < n; j++) {
            var truck = trucks[j];
            dist = geographicalDistance([parseFloat(cargo[3]), parseFloat(cargo[4])], [parseFloat(truck[3]), parseFloat(truck[4])]);
            edges[cCounter].push([cargo[0], truck[0], dist]);
            adjs[cCounter].push([truck[0], dist, tCounter]);
            adjs[tCounter].push([cargo[0], dist, cCounter]);
            tCounter += 1;

            if (dist < min) {
                min = dist;
            }
        }
        
        prices[cCounter] = min;
        steps.push([nodes[cCounter], min, 1]);
        cCounter += 1;
    }
}

function solveGraph(cargos, trucks) {
    n = trucks.length;
    m = cargos.length;
    adjs = [];
    edges = [];
    prices = [];
    matching = {};

    for (var i = 0; i < m + n; i++) {
        adjs.push([]);
        prices.push(0);
    }

    mountGraph(cargos, trucks, prices, adjs, edges);

    for (var i = 0; i < m; i++) {
        path = findGoodPath(adjs, matching, prices, i);
        updateMatching(matching, path);
    }

    distance = 0;
    solution = [];

    for (var i = 0; i < m; i++) {
        distance += edges[i][matching[i] - m][2];
        solution.push(edges[i][matching[i] - m]);
    }

    return  [solution, distance];
}

function drawAlgorithm(cargos, trucks, edges, n, cl, tl) {
    e = edges;
    nodes = n;
    m = cl;
    n = tl;

    for (var i = 0; i < e.length; i++) {
        e[i].lastColor = '#ccc';
    }

    var result = solveGraph(cargos, trucks);
    result.push(steps);

    return result;
}

var e;
var nodes;
var m;
var n;
var steps = [];
