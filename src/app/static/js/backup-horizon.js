// START horizon.js ////////////////////////////////
d3.horizon = function() {
    var bands = 1, // between 1 and 5, typically
        mode = "offset", // or mirror
        curve = d3.curveLinear, // or basis, monotone, step-before, etc.
        x = d3_horizonX,
        y = d3_horizonY,
        w = width,
        h = 40;

    var color = d3.scaleLinear()
        .domain([-1, 0, 1])
        .range(["#d62728", "#fff", "#1f77b4"]);

    // For each small multiple…
    function horizon(g) {
      g.each(function(d, i) {
        var g = d3.select(this),
            n = 2 * bands + 1,
            xMin = Infinity,
            xMax = -Infinity,
            yMax = -Infinity,
            x0, // old x-scale
            y0, // old y-scale
            t0,
            id; // unique id for paths

        // Compute x- and y-values along with extents.
        var data = d.map(function(d, i) {//verifica e atualiza o xMin/Max e o yMin/Max
          var xv = x.call(this, d, i),
              yv = y.call(this, d, i);
          if (xv < xMin) xMin = xv;
          if (xv > xMax) xMax = xv;
          if (-yv > yMax) yMax = -yv;
          if (yv > yMax/2) yMax = yv*2;
          return [xv, yv];
        });

        // Compute the new x- and y-scales, and transform.
        var x1 = d3.scaleLinear().domain([xMin, xMax]).range([0, w]),
            y1 = d3.scaleLinear().domain([0, yMax]).range([0, h * bands]),
            t1 = d3_horizonTransform(bands, h, mode);

        // Retrieve the old scales, if this is an update.
        if (this.__chart__) {
          x0 = this.__chart__.x;
          y0 = this.__chart__.y;
          t0 = this.__chart__.t;
          id = this.__chart__.id;
        } else {
          x0 = x1.copy();
          y0 = y1.copy();
          t0 = t1;
          id = ++d3_horizonId;
        }

        // We'll use a defs to store the area path and the clip path.
        var defs = g.selectAll("defs")
            .data([null]);

        // The clip path is a simple rect.
        defs.enter().append("defs").append("clipPath")
            .attr("id", "d3_horizon_clip" + id)
          .append("rect")
            .attr("width", w)
            .attr("height", h);

        //criando transição
        //defs.select("rect").transition()
        //    .duration(duration)
        //    .attr("width", w)
        //    .attr("height", h);

        // We'll use a container to clip all horizon layers at once.
        g.selectAll("g")
            .data([null])
          .enter().append("g")
            .attr("clip-path", "url(#d3_horizon_clip" + id + ")");

        // Instantiate each copy of the path with different transforms.
        var path = g.select("g").selectAll("path")
            .data(d3.range(-1, -bands - 1, -1).concat(d3.range(1, bands + 1)), Number);

        var d0 = d3_horizonArea
            .curve(curve)
            .x(function(d) { return x0(d[0]); })
            .y0(h * bands)
            .y1(function(d) { return h * bands - y0(d[1]); })
            (data);

        var d1 = d3_horizonArea
            .x(function(d) { return x1(d[0]); })
            .y1(function(d) { return h * bands - y1(d[1]); })
            (data);

        path.enter().append("path")
            .style("fill", 'none')
            .attr("transform", t0)
            .attr("d", d0)
            .style("stroke", "blue");

        //path.transition()
        //    .duration(duration)
        //    .style("fill", color)
        //    .attr("transform", t1)
        //    .attr("d", d1);

        //path.exit().transition()
        //    .duration(duration)
        //    .attr("transform", t1)
        //    .attr("d", d1)
        //    .remove();

        // Stash the new scales.
        this.__chart__ = {x: x1, y: y1, t: t1, id: id};
      });
      //d3.timerFlush();
    }

    //horizon.duration = function(x) {
    //  if (!arguments.length) return duration;
    //  duration = +x;
    //  return horizon;
    //};

    horizon.bands = function(x) {
      if (!arguments.length) return bands;
      bands = +x;
      color.domain([-bands, -1, 1, bands]);
      return horizon;
    };

    horizon.mode = function(x) {
      if (!arguments.length) return mode;
      mode = x + "";
      return horizon;
    };

    horizon.colors = function(x) {
      if (!arguments.length) return color.range();
      color.range(x);
      return horizon;
    };

    horizon.curve = function(x) {
      if (!arguments.length) return curve;
      curve = x;
      return horizon;
    };

    horizon.x = function(z) {
      if (!arguments.length) return x;
      x = z;
      return horizon;
    };

    horizon.y = function(z) {
      if (!arguments.length) return y;
      y = z;
      return horizon;
    };

    horizon.width = function(x) {
      if (!arguments.length) return w;
      w = +x;
      return horizon;
    };

    horizon.height = function(x) {
      if (!arguments.length) return h;
      h = +x;
      return horizon;
    };

    return horizon;
  };

  var d3_horizonArea = d3.area();
  var d3_horizonId = 0;

  function d3_horizonX(d) {
    return d[0];
  }

  function d3_horizonY(d) {
    return d[1];
  }

  function d3_horizonTransform(bands, h, mode) {
    return mode == "offset"
        ? function(d) { return "translate(0," + (d + (d < 0) - bands) * h + ")"; }
        : function(d) { return (d < 0 ? "scale(1,-1)" : "") + "translate(0," + (d - bands) * h + ")"; };
  }
// END horizon.js ////////////////////////////////



var width = document.querySelector("#horizon-container").offsetWidth -10;
var height = 40;
//var updateDelay = 50;

//inicializando o horizon chart
var chart = d3.horizon()
    .width(width)
    .height(height)
    .bands(1)
    .mode("offset")
    .curve(d3.curveMonotoneX)
    //.curve(d3.curveStep)
    .colors(["#d62728", "#fff", "#1f77b4"]);

//inserindo svg no body
var svr = d3.select()
var svg = d3.select("#horizon-chart").append("svg")
    .attr("width", width)
    .attr("height", height);

function cria_dados(dados){
    //criando dados
  data = []
  for (var timestamp in dados){
    if (dados.hasOwnProperty(timestamp)) {
      data.push([timestamp,dados[timestamp]])
    }
  }
  return data;
}


function start(){
  var data_selecionada = document.getElementById("date-horizon1").value;
  var sensor_selecionado = document.getElementById("sensor-horizon1").value;
  $.post("/executa", {data_selecionada: data_selecionada, sensor_selecionado: sensor_selecionado}, function(data){
    console.log(data);
    dados = cria_dados(data.response);
    console.log(dados);
    svg.data([dados]).call(chart);
  })
  //renderizando
  //svg.data([data]).call(chart)
}

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();

if (dd < 10) {
  dd = '0' + dd;
}

if (mm < 10) {
  mm = '0' + mm;
}	
document.getElementById("date-horizon1").value = yyyy+"-"+mm+"-"+dd;

//document.getElementById("btn-plota").onclick(start());
//doUpdate();