Element.prototype.removeChilds = function(){
    while(this.firstElementChild){
        this.removeChild(this.firstElementChild);
    }
}


function executa_parallel() {

    var data_selecionada = document.getElementById("date-parallel").value;

    $.post("/executa_parallel", { data_selecionada: data_selecionada }, function (data) {
        //console.log(data);
        //console.log(data.response);
        render_parallel(data.response);
    })

}


function render_parallel(dataset) {

    $('.svg').remove();
    var margin = { top: 50, right: 20, bottom: 30, left: 40 },
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var svg = d3.select('body')
        .append('svg')
        .attr('width', width + margin.left + margin.right + 20)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    var y = {}
    var x = d3.scalePoint()
        .domain(dimensions = d3.keys(dataset[0])
            .filter(function (d) {
                return d != 'name' &&
                    (y[d] = d3.scaleLinear()
                        .domain(d3.extent(dataset, function (p) {
                            // console.log(p,d);
                            return +p[d];
                        }))
                        .range([height, 0]));
            }))
        .range([0, width]);
        //console.log(dimensions); //["horario", "Temperatura 1", "Temperatura 2", "Temperatura 3"]
    // dimensions = [
    //     "Horario",
    //     "Temperatura 1",
    //     "Temperatura 2",
    //     "Temperatura 3"
    // ];
    var line = d3.line();
    var axis = d3.axisLeft();
    var background = svg.append('g')
        .attr('class', 'line').selectAll('path')
        .data(dataset)
        .enter().append('path')
        .attr('d', function (d) {
            // console.log(d);
            return line(dimensions.map(function (p) {
                return [x(p), y[p](d[p])];
            }));
        })
        .style('fill', 'none')
        .style('stroke-width', 1)
        // .style('stroke', 'rgba(40, 131, 198, 0.65)');
        .style('stroke', '#ccc');
    var foreground = svg.append('g')
        .attr('class', 'line').selectAll('path')
        .data(dataset)
        .enter().append('path')
        .attr('d', function (d) {
            return line(dimensions.map(function (p) {
                return [x(p), y[p](d[p])];
            }));
        })
        .style('fill', 'none')
        .style('stroke-width', 1)
        // .style('stroke', 'rgba(40, 131, 198, 0.65)');
        .style('stroke', function (d, i) { return color(i); });
    var g = svg.selectAll('.dimension')
        .data(dimensions)
        .enter().append('g')
        .attr('class', 'dimension')
        .attr('transform', function (d) { return `translate(${x(d)})`; });
    g.append('g')
        .attr('class', 'axis')
        .each(function (d) {
            console.log(y[d]);
            console.log(d);
            d3.select(this).call(axis.scale(y[d]));
        })
        .append('text')
        .style('text-anchor', 'middle')
        .attr('y', -9)
        .attr('fill', 'black')
        .text(function (d) { return d; });
        
    var brush = d3.brushY().extent([[-12, 0], [12, height]])
        .on('brush', brushed)
        .on('end', brushEnded);
    g.append('g')
        .attr('class', 'brush')
        .each(function (d) {
            // console.log(d);
            d3.select(this).call(brush);
        });
    var conditions = {};
    function brushed(d) {
        conditions[d] = d3.event.selection.map(y[d].invert);
        // console.log(conditions[d][0], conditions[d][1]);
        hide();
    }
    function brushEnded(d) {
        if (d3.event.selection === null) {
            delete conditions[d];
            hide();
        }
    }
    function hide() {
        foreground.style('display', function (d) {
            for (var k in conditions) {
                if (d[k] >= conditions[k][0] || d[k] <= conditions[k][1]) {
                    return 'none';
                }
            }
        });
    }

    axisHorario = $('.axis')[0];
    axisHorario.removeChilds();
    axisHorario.innerHTML = '<path class="domain" stroke="currentColor" d="M-6,420.5H0.5V0.5H-6"></path> <g class="tick" opacity="1" transform="translate(0,0.0416666667)"> <line stroke="currentColor" x2="-6"></line> <text fill="currentColor" x="-9" dy="0.32em">23:59</text></g> <g class="tick" opacity="1" transform="translate(0,35.0416666667)"> <line stroke="currentColor" x2="-6"></line> <text fill="currentColor" x="-9" dy="0.32em">22:00</text></g> <g class="tick" opacity="1" transform="translate(0,70.0833333334)"> <line stroke="currentColor" x2="-6"></line> <text fill="currentColor" x="-9" dy="0.32em">20:00</text></g> <g class="tick" opacity="1" transform="translate(0,105.125)"> <line stroke="currentColor" x2="-6"></line> <text fill="currentColor" x="-9" dy="0.32em">18:00</text></g> <g class="tick" opacity="1" transform="translate(0,140.166666666)"> <line stroke="currentColor" x2="-6"></line> <text fill="currentColor" x="-9" dy="0.32em">16:00</text></g> <g class="tick" opacity="1" transform="translate(0,175.208333333)"> <line stroke="currentColor" x2="-6"></line><text fill="currentColor" x="-9" dy="0.32em">14:00</text></g><g class="tick" opacity="1" transform="translate(0,210.25)"><line stroke="currentColor" x2="-6"></line><text fill="currentColor" x="-9" dy="0.32em">12:00</text></g><g class="tick" opacity="1" transform="translate(0,245.291666666)"><line stroke="currentColor" x2="-6"></line><text fill="currentColor" x="-9" dy="0.32em">10:00</text></g><g class="tick" opacity="1" transform="translate(0,280.33333333)"><line stroke="currentColor" x2="-6"></line><text fill="currentColor" x="-9" dy="0.32em">08:00</text></g><g class="tick" opacity="1" transform="translate(0,315.375)"><line stroke="currentColor" x2="-6"></line><text fill="currentColor" x="-9" dy="0.32em">06:00</text></g><g class="tick" opacity="1" transform="translate(0,350.416666667)"><line stroke="currentColor" x2="-6"></line><text fill="currentColor" x="-9" dy="0.32em">04:00</text></g><g class="tick" opacity="1" transform="translate(0,385.458333333)"><line stroke="currentColor" x2="-6"></line><text fill="currentColor" x="-9" dy="0.32em">02:00</text></g><g class="tick" opacity="1" transform="translate(0,420.5)"><line stroke="currentColor" x2="-6"></line><text fill="currentColor" x="-9" dy="0.32em">00:00</text></g><text y="-9" fill="black" style="text-anchor: middle;">Horario:</text>';

}

