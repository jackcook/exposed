function generate_calendar(name) {
  var calendar_width = 960,
      calendar_height = 136,
      cellSize = 17; // cell size

  var calendar_format = d3.time.format("%Y-%m-%d");

  var calendar_color = d3.scale.quantize()
      .domain([0, 733])
      .range(d3.range(4).map(function(d) { return "q" + d + "-4"; }));

  var svg = d3.select("body").selectAll("svg")
      .data(d3.range(2015, 2017))
    .enter().append("svg")
      .attr("width", calendar_width)
      .attr("height", calendar_height)
      .attr("class", "RdYlGn")
    .append("g")
      .attr("transform", "translate(" + ((calendar_width - cellSize * 53) / 2) + "," + (calendar_height - cellSize * 7 - 1) + ")");

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
      .datum(calendar_format);

  rect.append("title")
      .text(function(d) { return d; });

  svg.selectAll(".month")
      .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter().append("path")
      .attr("class", "month")
      .attr("d", monthPath);

  d3.csv("dates_" + name + ".csv", function(error, csv) {
    if (error) throw error;

    var data = d3.nest()
      .key(function(d) { return d.Date; })
      .rollup(function(d) { return d[0].Messages; })
      .map(csv);

    rect.filter(function(d) { return d in data; })
        .attr("class", function(d) { return "day " + calendar_color(data[d]); })
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
  var emoticons_width = 960,
      emoticons_height = 500,
      emoticons_radius = Math.min(emoticons_width, emoticons_height) / 2;

  var emoticons_color = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var arc = d3.svg.arc()
      .outerRadius(emoticons_radius - 10)
      .innerRadius(emoticons_radius - 70);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.instances; });

  var svg = d3.select("body").append("svg")
      .attr("width", emoticons_width)
      .attr("height", emoticons_height)
    .append("g")
      .attr("transform", "translate(" + emoticons_width / 2 + "," + emoticons_height / 2 + ")");

  d3.csv("emojis_" + name + ".csv", type, function(error, data) {
    if (error) throw error;

    var g = svg.selectAll(".arc")
        .data(pie(data))
      .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return emoticons_color(d.data.emoticon); });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data.emoticon; });
  });

  function type(d) {
    d.instances = +d.instances;
    return d;
  }
}