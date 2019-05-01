from flask import render_template, request, jsonify, send_from_directory

from app import app
from .visualization import Visualization
from .parallel import Parallel

vis = Visualization()
#parallel_class = Parallel()

@app.route('/', methods=['GET'])
@app.route('/home', methods=['GET'])
@app.route('/index', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/executa', methods=['POST'])
def executa():
    assert request.path == '/executa'
    assert request.method == 'POST'
    resp = vis.executa_horizon(request.form['data_selecionada'], request.form['sensor_selecionado'])

    return jsonify({'response':resp})

@app.route('/<path:path>')
def send_js(path):
    return send_from_directory('static/csv/', path, as_attachment=True)

@app.route('/parallel', methods=['GET'])
def parallel():
        return render_template('parallel.html')

@app.route('/executa_parallel', methods=['POST'])
def executa_parallel():
    assert request.path == '/executa_parallel'
    assert request.method == 'POST'
    resp = vis.executa_parallel(request.form['data_selecionada'])

    return jsonify({'response':resp})