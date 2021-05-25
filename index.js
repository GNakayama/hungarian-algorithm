var graph, edges, nodes, s;
var speed = 10;
var token;
var result;
var step = 0;
var reverseSteps = [];

function drawStep(steps) {
    if (steps.length <= step || step < 0) {
        speed = 10;
        clearTimeout(token);
        return;
    }

    if (speed < 0) {
        reverseUpdateGraph(reverseSteps[step][0], reverseSteps[step][1], reverseSteps[step][2]);
        step -= 1;
    } else {
        updateGraph(steps[step][0], steps[step][1], steps[step][2]);
        step += 1;
    }

    token = setTimeout(function(){drawStep(steps);}, Math.abs(speed));
}

function updateGraph(element, attrib, type) {
    var reverseStep = [element, attrib, type];

    switch (type) {
        case 0:
            reverseStep[1] = element.color;
            element.color = attrib;
            graph.addEdge(element);
            break;
        case 1:
            reverseStep[1] = element.label;
            element.label = attrib.toString();
            break;
        case 2:
            graph.dropEdge(element.id);
            break;
        case 3:
            reverseStep[1] = element.color;
            element.color = attrib;
            break;
        case 4:
            graph.dropEdge(element.id);
            reverseStep[1] = element.color;
            element.color = attrib;
            graph.addEdge(element);
            break;
    }

    if (step >= reverseSteps.length) {
        reverseSteps.push(reverseStep);
    }

    s.refresh();
}

function reverseUpdateGraph(element, attrib, type) {
    switch (type) {
        case 0:
            graph.dropEdge(element.id);
            break;
        case 1:
            element.label = attrib.toString();
            break;
        case 2:
            graph.addEdge(element);
            break;
        case 3:
            element.color = attrib;
            break;
        case 4:
            graph.dropEdge(element.id);
            element.color = attrib;
            graph.addEdge(element);
            break;
    }

    s.refresh();
}

function initGraph(tasks, workers) {
    var m = tasks.length;
    var n = workers.length;
    var N = m + n;
    var g = {
        'nodes': [],
        'edges': []
    };


    for (i = 0; i < m; i++) {
            g.nodes.push({
                'id': 'Task' + i,
                'label': '0',
                'x': 0.1,
                'y': 2*(1.0/(m - 1))*i,
                'size': 0.1,
                'color': '#600'
            });
    }

    for (i = 0; i < n; i++) {
            g.nodes.push({
                'id': 'Worker' + i,
                'label': '0',
                'x': 0.9,
                'y': 2*(1.0/(n - 1))*i,
                'size': 0.1,
                'color': '#006'
            });
    }

    for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++) {
            g.edges.push({
                'id': 'e' + i*n + j,
                'dist': i*j,
                'source': 'Task' + i,
                'target': 'Worker' + j,
                'color': '#ccc'
            });
        }
    }

    s = new sigma({
        'graph': g,
        'container': 'graph-container'
    });

    graph = s.graph;
    edges = graph.edges();
    nodes = graph.nodes();

    for (var i = 0; i < edges.length; i++) {
        graph.dropEdge(edges[i].id);
    }

    s.refresh();
}

function resetGraph() {
    var drawEdges = graph.edges();

    for (var i = 0; i < nodes.length; i++) {
        nodes[i].label = '' + 0;

        if (i < m) {
            nodes[i].color = '#600';
        } else {
            nodes[i].color = '#006';
        }
    }

    for (var i = 0; i < drawEdges.length; i++) {
        graph.dropEdge(drawEdges[i].id);
    }

    s.refresh();
}

function main() {
    var numberOfWorkers = 50;
    var numberOfTasks = 5;
    var tasks = [];
    var workers = [];

    for (var i = 0; i < numberOfWorkers; i++) {
      workers.push(Math.floor(Math.random() * 1000) + 1);
    }

    for (var i = 0; i < numberOfTasks; i++) {
      tasks.push(Math.floor(Math.random() * 1000) + 1);
    }

    if (workers.length < tasks.length) {
        console.log("Number of workers should be greater or equal to the number of tasks!");
    } else {
        initGraph(tasks, workers);
        result = drawAlgorithm(tasks, workers, edges, nodes, tasks.length, workers.length);
        console.log(result);
    }
}
