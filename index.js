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


    for (i = 0; i < N; i++) {
        if (i < m) {
            g.nodes.push({
                'id': 'Task' + i,
                'label': '0',
                'x': 0.1,
                'y': 2*(1.0/(m - 1))*i,
                'size': 0.1,
                'color': '#600'
            });
        } else {
            g.nodes.push({
                'id': 'Worker' + (i - m),
                'label': '0',
                'x': 0.9,
                'y': 2*(1.0/(n - 1))*(i - m),
                'size': 0.1,
                'color': '#006'
            });
        }
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
    var workers = [
        "Hartford Plastics Incartford",
        "Beyond Landscape & Design Llcilsonville",
        "Empire Of Dirt Llcquality",
        "James Haas Al Haas Shelly Haasairfield",
        "Ibrahim Chimandalpharetta",
        "John Bianchiake Havasu City",
        "Macomb Iron Llchesterfield",
        "Robert Robertsonairhope",
        "Viking Products Of Austin Incustin",
        "Arachus Incashville",
        "Dawna L Zanderppleton",
        "Michael J Geenenaukauna",
        "Peet'S Tree Serviceinterport",
        "Filippo Lumaroallston",
        "Jorge L Denisollywood",
        "Ramiro Castilloucson",
        "Paul J Krez Companyorton Grove",
        "Sullivans' Homestead Inclympia",
        "Jeffrey A Shepardypsum",
        "Wayne E Bollinauvoo",
        "Gary Lee Wilcoxpencer",
        "Jacques N Faucherochester",
        "Sidhu Trucking Incarrisburg",
        "Edmon'S Unique Furniture & Stone Gallery Inc.Os Angeles",
        "Ricardo Juradoacramento",
        "Turenne Auto Body Llchorp",
        "Allen R Pruittrown City",
        "Kjellberg'S Carpet Oneuffalo",
        "Dupree Testing Services Incutchinson",
        "Vincent Rodriguezansas City",
        "Loren Martinrand Junction",
        "I N H Relocation Services Incoodbridge",
        "Arrow Towing Llcent",
        "Scott Cassidylanchardville",
        "Como Construction Llcottstown",
        "High Pines Farm Llcontello",
        "Jwj Interests Incealy",
        "Efrain Morales Diazorwalk",
        "Rubye Hunterincolnton",
        "Jevin Q Watsonillsboro",
        "Martinez Transport Llcdaho Falls",
        "Jeffery Allan Luiacine",
        "Fish-Bones Towingew York",
        "Wisebuys Stores Incouverneur"
    ];

    var tasks = [
        "Light bulbs",
        "Recyclables",
        "Apples",
        "Wood",
        "Cell phones",
        "Wood",
        "Oranges"
    ]

    workers = workers.map(function(truck){return truck[0].split(',');});
    tasks = tasks.map(function(cargo){return cargo[0].split(',');});

    workersAux = Array.from(workers);
    for (var i = 0; i < 0; i++) {
        for (var j = 0; j < workersAux.length; j++) {
            var newTruck = Array.from(workers[j]);
            newTruck[0] += i;
            workers.push(newTruck);
        }
    }

    tasksAux = Array.from(tasks);
    for (var i = 0; i < 1; i++) {
        for (var j = 0; j < tasksAux.length; j++) {
            var newCargo = Array.from(tasks[j]);
            tasks.push(newCargo);
        }
    }

    if (workers.length < tasks.length) {
        console.log("Number of workers should be greater or equal to the number of tasks!");
    } else {
        initGraph(tasks, workers);
        result = drawAlgorithm(tasks, workers, edges, nodes, tasks.length, workers.length);
        console.log(result);
    }
}
