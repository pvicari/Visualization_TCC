var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();
var time = today.getTime() * -1;
var hora = today.getHours();
var minuto = today.getMinutes();
var segundos = today.getSeconds();
var milisegundos = ((hora) * 60 * 60 * 1000) + (minuto * 60 * 1000) + (segundos * 1000) + today.getMilliseconds();
var sensores_selecionados = [];

var context = cubism.context()
  .serverDelay(milisegundos)
  .step(1000 * 67, 5)
  .size(1280)
  .stop();


function render() {


  d3.select("#render").selectAll(".axis")
    .data(["top"])
    .enter().append("div")
    .attr("class", function (d) { return d + " axis"; })
    .each(function (d) { d3.select(this).call(context.axis().ticks(24).tickFormat(d3.time.format("%H")).orient(d)); });

  d3.select("#render").append("div")
    .attr("class", "rule")
    .call(context.rule());

  d3.select("#render").selectAll(".horizon")
    .data(sensores_selecionados.map(stock))
    .enter().insert("div", ".bottom")
    .attr("class", "horizon")
    .call(context.horizon()
    .format(d3.format(".f"))
    //.colors(["#51d8b9","#0e2f44"])
    );

    window.setTimeout(function(){sensores_selecionados = []}, 2000);
}

context.on("focus", function (i) {
  d3.selectAll(".value").style("right", i == null ? null : context.size() - i + "px");
});


function cria_csv(name) {
  var data_selecionada = document.getElementById("date-horizon1").value;

  $.post("/executa", { data_selecionada: data_selecionada, sensor_selecionado: name }, function (data) {
    //console.log(data);
    //dados = cria_dados(data.response);
    //console.log(dados);
    //svg.data([dados]).call(chart);
  })

  window.setTimeout(() => start(), 5500);

  return true;
}


// Replace this with context.graphite and graphite.metric!
function stock(name) {
  var format = d3.time.format("%H-%M-%S");
  let string_name = name + ".csv";

  return context.metric(function (start, stop, step, callback) {
    d3.csv(string_name, function (rows) {
      console.log("testando: ");
      console.log(string_name);
      console.log(rows);
      rows = rows.map(function (d) { return [format.parse(d.Hora), +d.Valor]; }).filter(function (d) { return d[1]; }).reverse();
      var date = rows[0][0], compare = rows[400][1], value = rows[0][1], values = [value];
      console.log("compare: ");
      console.log(compare);
      console.log(values);
      rows.forEach(function (d) {
        //while ((date = d3.time.day.offset(date, 1)) < d[0]) values.push(value);
        values.push(value = d[1]);
      });
      callback(null, values);
    });
  }, name);
}

function start() {

  //var sensor_selecionado = document.getElementById("sensor-horizon1").value;
  render();
  document.getElementById("executa-btn").disabled = true;

}

function carrega() {
  carrega_vetor();
  if (!sensores_selecionados.length == 0) {
    sensores_selecionados.map(cria_csv);
  }
}

function carrega_vetor() {
  console.log("Entrei na funcao");
  if (document.getElementById("chk-temp1").checked == true) {
    sensores_selecionados.push("Temperatura_1");
  }
  if (document.getElementById("chk-temp2").checked == true) {
    sensores_selecionados.push("Temperatura_2");
  }
  if (document.getElementById("chk-temp3").checked == true) {
    sensores_selecionados.push("Temperatura_3");
  }
  if (document.getElementById("chk-umi1").checked == true) {
    sensores_selecionados.push("Umidade_1");
  }
  if (document.getElementById("chk-umi2").checked == true) {
    sensores_selecionados.push("Umidade_2");
  }
  if (document.getElementById("chk-umi3").checked == true) {
    sensores_selecionados.push("Umidade_3");
  }
}

function get_json_parallel(){
  
}

if (dd < 10) {
  dd = '0' + dd;
}

if (mm < 10) {
  mm = '0' + mm;
}
document.getElementById("date-horizon1").value = yyyy+"-"+mm+"-"+dd;

//document.getElementById("btn-plota").onclick(start());
//doUpdate();