var graph, edges, nodes, s;
var speed = 10;

function drawStep(steps, step) {
    if (steps.length <= step || step < 0) {
        return;
    }

    updateGraph(steps[step][0], steps[step][1], steps[step][2]);
    setTimeout(function(){drawStep(steps, step + 1);}, speed);
}

function updateGraph(element, attrib, type) {
    switch (type) {
        case 0:
            element.color = attrib;
            graph.addEdge(element);
            break;
        case 1:
            element.label = attrib.toString();
            break;
        case 2:
            graph.dropEdge(element.id);
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
                'size': 1,
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
}

function main() {
    var trucks = [["Hartford Plastics Incartford,Florence,AL,34.79981,-87.677251"],
        ["Beyond Landscape & Design Llcilsonville,Fremont,CA,37.5482697,-121.9885719"],
        ["Empire Of Dirt Llcquality,Hampden,ME,44.7445421,-68.8370436"],
        ["James Haas Al Haas Shelly Haasairfield,North East,MD,39.6001132,-75.94133269999999"],
        ["Ibrahim Chimandalpharetta,Toledo,OH,41.6639383,-83.55521200000001"],
        ["John Bianchiake Havasu City,Renton,WA,47.48287759999999,-122.2170661"],
        ["Macomb Iron Llchesterfield,Cleveland,OH,41.49932,-81.6943605"],
        ["Robert Robertsonairhope,Green Bay,WI,44.51915899999999,-88.019826"],
        ["Viking Products Of Austin Incustin,Fort Campbell,TN,36.6634467,-87.47739020000002"],
        ["Arachus Incashville,Bethlehem,PA,40.6259316,-75.37045789999999"],
        ["Dawna L Zanderppleton,Burbank,WA,46.1998568,-119.0130618"],
        ["Michael J Geenenaukauna,Lubbock,TX,33.5778631,-101.8551665"],
        ["Peet'S Tree Serviceinterport,Schertz,TX,29.5521737,-98.269734"],
        ["Filippo Lumaroallston,La Porte,TX,29.6657838,-95.0193728"],
        ["Jorge L Denisollywood,Delta,CO,38.7422062,-108.0689582"],
        ["Ramiro Castilloucson,Logan,UT,41.7369803,-111.8338359"],
        ["Paul J Krez Companyorton Grove,Forest City,NC,35.3340108,-81.8651028"],
        ["Sullivans' Homestead Inclympia,Deerfield Beach,FL,26.3184123,-80.09976569999999"],
        ["Jeffrey A Shepardypsum,Dalton,GA,34.7698021,-84.9702228"],
        ["Wayne E Bollinauvoo,North Logan,UT,41.7693747,-111.8046654"],
        ["Gary Lee Wilcoxpencer,Eagle River,WI,45.9171763,-89.2442988"],
        ["Jacques N Faucherochester,Mission,KS,39.0277832,-94.6557914,"],
        ["Sidhu Trucking Incarrisburg,Hawkins,TX,32.58847350000001,-95.20411349999999"],
        ["Edmon'S Unique Furniture & Stone Gallery Inc.Os Angeles,Bolingbrook,IL,41.69864159999999,-88.0683955"],
        ["Ricardo Juradoacramento,Covesville,VA,37.8901411,-78.70474010000001"],
        ["Turenne Auto Body Llchorp,Schertz,TX,29.5521737,-98.269734"],
        ["Allen R Pruittrown City,La Porte,TX,29.6657838,-95.0193728"],
        ["Kjellberg'S Carpet Oneuffalo,Mount Vernon,OH,40.3933956,-82.4857181"],
        ["Dupree Testing Services Incutchinson,Houston,TX,29.7604267,-95.3698028"],
        ["Vincent Rodriguezansas City,Flagstaff,AZ,35.1982836,-111.651302"],
        ["Loren Martinrand Junction,Forest Grove,OR,45.5198364,-123.1106631"],
        ["I N H Relocation Services Incoodbridge,San Antonio,TX,29.4241219,-98.49362819999999"],
        ["Arrow Towing Llcent,Hackettstown,NJ,40.8539879,-74.8290555"],
        ["Scott Cassidylanchardville,Denver,CO,39.76161889999999,-104.9622498"],
        ["Como Construction Llcottstown,Wanaque,NJ,41.0381525,-74.2940378"],
        ["High Pines Farm Llcontello,Chicago,IL,41.8781136,-87.6297982"],
        ["Jwj Interests Incealy,Glen Burnie,MD,39.1626084,-76.6246886"],
        ["Efrain Morales Diazorwalk,Marshfield,MO,37.338658,-92.9071209"],
        ["Rubye Hunterincolnton,Elizabeth,NJ,40.6639916,-74.2107006"],
        ["Jevin Q Watsonillsboro,McDonough,GA,33.4473361,-84.1468616"],
        ["Martinez Transport Llcdaho Falls,Chicago,IL,41.8781136,-87.6297982"],
        ["Jeffery Allan Luiacine,Tuscaloosa,AL,33.2098407,-87.56917349999999"],
        ["Fish-Bones Towingew York,Monroe,WI,42.60111939999999,-89.6384532"],
        ["Wisebuys Stores Incouverneur,Washington,WV,39.244853,-81.6637765"]];

    var cargos = [["Light bulbs,Sikeston,MO,36.876719,-89.5878579,Grapevine,TX,32.9342919,-97.0780654"],
        ["Recyclables,Christiansburg,VA,37.1298517,-80.4089389,Apopka,FL,28.6934076,-81.5322149"],
        ["Apples,Columbus,OH,39.9611755,-82.99879419999999,Woodland,CA,38.67851570000001,-121.7732971"],
        ["Wood,Hebron,KY,39.0661472,-84.70318879999999,Jefferson,LA,29.96603709999999,-90.1531298"],
        ["Cell phones,Hickory,NC,35.7344538,-81.3444573,La Pine,OR,43.67039949999999,-121.503636"],
        ["Wood,Northfield,MN,44.4582983,-93.161604,Waukegan,IL,42.3636331,-87.84479379999999"],
        ["Oranges,Fort Madison,IA,40.6297634,-91.31453499999999,Ottawa,IL,41.3455892,-88.8425769"]]

    trucks = trucks.map(function(truck){return truck[0].split(',');});
    cargos = cargos.map(function(cargo){return cargo[0].split(',');});

    trucksAux = Array.from(trucks);
    for (var i = 0; i < 0; i++) {
        for (var j = 0; j < trucksAux.length; j++) {
            var newTruck = Array.from(trucks[j]);
            newTruck[0] += i;
            //newTruck[3] = str(float(newTruck[3]) - randint(1, 1000)/1000);
            //newTruck[4] = str(float(newTruck[4]) + randint(1, 2000)/2000);
            trucks.push(newTruck);
        }
    }

    cargosAux = Array.from(cargos);
    for (var i = 0; i < 1; i++) {
        for (var j = 0; j < cargosAux.length; j++) {
            var newCargo = Array.from(cargos[j]);
            //newCargo[3] = str(float(newCargo[3]) + randint(1, 1000)/1000);
            //newCargo[4] = str(float(newCargo[4]) - randint(1, 2000)/2000);
            cargos.push(newCargo);
        }
    }

    if (trucks.length < cargos.length) {
        console.log("Number of workers should be greater or equal to the number of tasks!");
    } else {
        initGraph(cargos, trucks);
        result = drawAlgorithm(cargos, trucks, edges, nodes, cargos.length, trucks.length);
        console.log(result);

        setTimeout(function(){drawStep(result[2], 0);}, 1000);
    }
}
