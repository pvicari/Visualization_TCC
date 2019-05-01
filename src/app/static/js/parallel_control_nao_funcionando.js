function executa_parallel() {

    var data_selecionada = document.getElementById("date-parallel").value;

    $.post("/executa_parallel", { data_selecionada: data_selecionada }, function (data) {
        //console.log(data);
        console.log(data);
        console.log(data.response);
        render_parallel(data.response);
    })

}


function render_parallel(data) {

    var margin = { top: 30, right: 10, bottom: 10, left: 10 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scaleOrdinal([0, width], 1),
        y = {},
        dragging = {};

    var line = d3.line(),
        axis = d3.axisLeft(),
        background,
        foreground;

    var svg = d3.select("body").append("svg").data(data)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(dimensions = d3.keys(data[0]).filter(function (d) {
        return y[d] = d3.scaleLinear()
            .domain(d3.extent(data, function (p) {
                return +p[d];
            }))
            .range([height, 0]);
    }));

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path);

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
        .call(d3.drag()
            .origin(function (d) { return { x: x(d) }; })
            .on("dragstart", function (d) {
                dragging[d] = x(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function (d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function (a, b) { return position(a) - position(b); });
                x.domain(dimensions);
                g.attr("transform", function (d) { return "translate(" + position(d) + ")"; })
            })
            .on("dragend", function (d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                transition(foreground).attr("d", path);
                background
                    .attr("d", path)
                    .transition()
                    .delay(500)
                    .duration(0)
                    .attr("visibility", null);
            }));

    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function (d) { d3.select(this).call(axis.scale(y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function (d) {
            return d;
        });

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function (d) {
            d3.select(this).call(y[d].brush = d3.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);
    //});

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function (p) { return [position(p), y[p](d[p])]; }));
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = dimensions.filter(function (p) { return !y[p].brush.empty(); }),
            extents = actives.map(function (p) { return y[p].brush.extent(); });
        foreground.style("display", function (d) {
            return actives.every(function (p, i) {
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }) ? null : "none";
        });
    }

}//end function



// function render_parallel(data) {
//     //console.log(data);
//     Highcharts.chart('render', {
//         chart: {
//             type: 'line',
//             parallelCoordinates: true,
//             parallelAxes: {
//                 lineWidth: 1
//             }
//         },
//         title: {
//             text: 'Sensores'
//         },
//         plotOptions: {
//             series: {
//                 animation: false,
//                 marker: {
//                     enabled: false,
//                     states: {
//                         hover: {
//                             enabled: false
//                         }
//                     }
//                 },
//                 states: {
//                     hover: {
//                         halo: {
//                             size: 0
//                         }
//                     }
//                 },
//                 events: {
//                     mouseOver: function () {
//                         this.group.toFront();
//                     }
//                 }
//             }
//         },
//         tooltip: {
//             pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
//                 '{series.name}: <b>{point.formattedValue}</b><br/>'
//         },
//         xAxis: {
//             categories: [
//                 'Hora',
//                 'Temperatura 1',
//                 'Temperatura 2',
//                 'Temperatura 3'
//                 //'Umidade 1',
//                 //'Umidade 2',
//                 //'Umidade 3'
//             ],
//             offset: 10
//         },
//         yAxis: [{
//             type: 'datetime',
//             min: 0,
//             labels: {
//                 format: '{value:%H:%M}'
//             }
//         }, {
//             min: 0,
//             tooltipValueFormat: '{value} C'
//         }, {
//             min: 0,
//             tooltipValueFormat: '{value} C'
//         }, {
//             min: 0,
//             tooltipValueFormat: '{value} C'
//        // }, {
//        //     min: 0,
//        //     tooltipValueFormat: '{value} %'
//        // }, {
//        //    tooltipValueFormat: '{value} %'
//        // }, {
//        //     tooltipValueFormat: '{value} %'
//         }],
//         colors: ['rgba(11, 200, 200, 0.1)'],
//         series: data.map(function (set, i) {
//             return {
//                 name: 'Runner ' + i,
//                 data: set,
//                 shadow: false
//             };
//         })
//     });


// }