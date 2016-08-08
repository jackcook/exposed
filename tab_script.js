function generate_calendar(name) {
    var width = 760,
        height = 136,
        cellSize = 13;

    var format = d3.time.format("%Y-%m-%d");

    var color = d3.scale.quantize()
        .domain([0, 733])
        .range(d3.range(4).map(function(d) { return "q" + d + "-4"; }));

    var svg = d3.select("#content").selectAll("svg")
        .data(d3.range(2015, 2017))
        .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "RdYlGn")
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .text(function(d) { return d; });

    var rect = svg.selectAll(".day")
        .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
        .attr("y", function(d) { return d.getDay() * cellSize; })
        .datum(format);

    rect.append("title")
        .text(function(d) { return d; });

    svg.selectAll(".month")
        .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);

    d3.csv("data/dates_" + name + ".csv", function(error, csv) {
        if (error) throw error;

        var data = d3.nest()
            .key(function(d) { return d.Date; })
            .rollup(function(d) { return d[0].Messages; })
            .map(csv);

        rect.filter(function(d) { return d in data; })
            .attr("class", function(d) { return "day " + color(data[d]); })
            .select("title")
            .text(function(d) { return d + ": " + data[d] + " messages"; });
    });

    function monthPath(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
            d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
             + "H" + w0 * cellSize + "V" + 7 * cellSize
             + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
             + "H" + (w1 + 1) * cellSize + "V" + 0
             + "H" + (w0 + 1) * cellSize + "Z";
    }
}

function generate_emoticons(name) {
    var width = 240,
        height = 240,
        radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.instances; });

    var svg = d3.select("#graph_1").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    d3.csv("data/emojis_" + name + ".csv", type, function(error, data) {
        if (error) throw error;

        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data.emoticon); });

        g.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d) { return d.data.emoticon + " (" + d.data.instances + ")"; });
    });

    function type(d) {
        d.instances = +d.instances;
        return d;
    }
}

function generate_first(name) {
    var width = 240,
        height = 240,
        radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.instances; });

    var svg = d3.select("#graph_2").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    d3.csv("data/first_" + name + ".csv", type, function(error, data) {
        if (error) throw error;

        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data.person); });

        g.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d) {
              var firstName = d.data.person.split(" ")[0];
              return firstName + " (" + d.data.instances + ")";
            });
    });

    function type(d) {
        d.instances = +d.instances;
        return d;
    }
}

function generate_messages(name) {
    var width = 240,
        height = 240,
        radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.instances; });

    var svg = d3.select("#graph_3").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    d3.csv("data/messages_" + name + ".csv", type, function(error, data) {
        if (error) throw error;

        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data.person); });

        g.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d) {
              var firstName = d.data.person.split(" ")[0];
              return firstName + " (" + d.data.instances + ")";
            });
    });

    function type(d) {
        d.instances = +d.instances;
        return d;
    }
}

function generate_charts(name) {
    generate_calendar(name);
    generate_emoticons(name);
    generate_first(name);
    generate_messages(name);
}
