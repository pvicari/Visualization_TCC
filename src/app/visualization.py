import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from datetime import datetime, timedelta
import math


class Visualization:

    def __init__(self):

        cred = credentials.Certificate(
            "app/sensoresfct2018-firebase-adminsdk-fkxoy-b0c3c4ff00.json")
        firebase_admin.initialize_app(cred, {
            'databaseURL': "https://sensoresfct2018.firebaseio.com"
        })

    #database = db.reference("DadosSensores/Temperatura/1/")

    @staticmethod
    def atualiza_dia(day):  # adiciona 0 ao dia se dia < 10 Ex: 1 -> 01
        if day < 10:
            return '0{}'.format(day)
        return day

    @staticmethod
    def atualiza_mes(month):  # adiciona 0 ao mes se mes < 10 Ex: 1 -> 01
        if month < 10:
            return '0{}'.format(month)
        return month

    # cria todos os segundos do dia
    @staticmethod
    def perdelta(start, end, delta):
        curr = start
        while curr <= end:
            yield curr
            curr += delta

    def executa_horizon(self, data_selecionada, sensor_selecionado):
        print("Data")
        print(data_selecionada)
        data_selecionada = data_selecionada.split('-')
        print("Data split: ")
        print(data_selecionada)
        # now = datetime.now() #utilizando o now, depois sera por datepicker
        now = datetime(int(data_selecionada[0]), int(
            data_selecionada[1]), int(data_selecionada[2]))
        data_yesterday = datetime(
            now.year, now.month, now.day) - timedelta(days=1)  # pegando dia anterior

        data = '{}-{}-{}'.format(
            self.atualiza_dia(now.day),
            self.atualiza_mes(now.month),
            now.year)  # montando string

        data_y = '{}-{}-{}'.format(
            self.atualiza_dia(data_yesterday.day),
            self.atualiza_mes(data_yesterday.month),
            data_yesterday.year)  # montando string

        dict_times = [str(t.time()) for t in self.perdelta(datetime(1, 1, 1, 0, 0, 0), datetime(1, 1, 1, 23, 59, 59), timedelta(seconds=1))]

        sensores = {}
        sensores['Temperatura_1'] = "Temperatura/1"
        sensores['Temperatura_2'] = "Temperatura/2"
        sensores['Temperatura_3'] = "Temperatura/3"
        sensores['Umidade_1'] = "Umidade/1"
        sensores['Umidade_2'] = "Umidade/2"
        sensores['Umidade_3'] = "Umidade/3"
        sensores['Luz_1'] = "Luz/1"
        sensores['Luz_2'] = "Luz/2"
        sensores['Luz_3'] = "Luz/3"

        
        sensor_csv = 'app/static/csv/{}.csv'.format(sensor_selecionado)

        # criando caminho para pegar os dados
        ref = 'DadosSensores/{}/{}'.format(sensores[sensor_selecionado], data)
        # criando caminho para pegar ultimo valor do dia anterior
        ref_yesterday = 'DadosSensores/{}/{}'.format(
            sensores[sensor_selecionado], data_y)
        print(ref)
        dados = db.reference(ref).order_by_key().get()  # pegando dados
        last_yesterday = db.reference(ref_yesterday).order_by_key(
        ).limit_to_last(1).get()  # pegando ultimo valor dia anterior

        for i in last_yesterday:
            for a in last_yesterday[i]:
                ultimo_valor = float(last_yesterday[i][a])

        
        with open(sensor_csv, "w") as txt:
            string = ""
            valor = ultimo_valor
            #print(valor)
            string += "Hora,Valor\n"
            for el in dict_times:
                if el in dados:
                    for a in dados[el]:
                        valor = dados[el][a]
                #print(valor)        
                string += "{},{}\n".format(el, valor)
            txt.write(string)
        
        return

    # criando JSON -----------------------------------------------------------------------
    # print(f"yesterday:{dados}")
    #auxiliar = 0
    #valores = {}
    #valores[auxiliar] = ultimo_valor
    #auxiliar +=1
    #horarios = []
    # for i in dados:
    # horarios.append(str(i)) #guarda todos os horarios em uma lista
    # for a in dados[i]:
    #    valores[auxiliar] = float(dados[i][a]) #cria biblioteca horario : valor
    #    auxiliar +=1
    # print(horarios)
    # return valores


    def executa_parallel(self, data_selecionada):
        print("Data")
        print(data_selecionada)
        data_selecionada = data_selecionada.split('-')
        print("Data split: ")
        print(data_selecionada)
        # now = datetime.now() #utilizando o now, depois sera por datepicker
        now = datetime(int(data_selecionada[0]), int(
            data_selecionada[1]), int(data_selecionada[2]))
        data_yesterday = datetime(
            now.year, now.month, now.day) - timedelta(days=1)  # pegando dia anterior

        data = '{}-{}-{}'.format(
            self.atualiza_dia(now.day),
            self.atualiza_mes(now.month),
            now.year)  # montando string

        data_y = '{}-{}-{}'.format(
            self.atualiza_dia(data_yesterday.day),
            self.atualiza_mes(data_yesterday.month),
            data_yesterday.year)  # montando string

        dict_times = [str(t.time()) for t in self.perdelta(datetime(
            1, 1, 1, 0, 0, 0), datetime(1, 1, 1, 23, 59, 59), timedelta(seconds=1))]

        # criando caminho para pegar os dados
        # temperatura
        ref_temp1 = 'DadosSensores/Temperatura/1/{}'.format(data)
        ref_temp2 = 'DadosSensores/Temperatura/2/{}'.format(data)
        ref_temp3 = 'DadosSensores/Temperatura/3/{}'.format(data)
        # umidade
        # ref_umi1 = 'DadosSensores/Umidade/1/{}'.format(data)
        # ref_umi2 = 'DadosSensores/Umidade/2/{}'.format(data)
        # ref_umi3 = 'DadosSensores/Umidade/3/{}'.format(data)
        # criando caminho para pegar ultimo valor do dia anterior
        # Temperatura
        ref_yesterday_temp1 = 'DadosSensores/Temperatura/1/{}'.format(data_y)
        ref_yesterday_temp2 = 'DadosSensores/Temperatura/2/{}'.format(data_y)
        ref_yesterday_temp3 = 'DadosSensores/Temperatura/3/{}'.format(data_y)
        # Umidade
        # ref_yesterday_umi1 = 'DadosSensores/Umidade/1/{}'.format(data_y)
        # ref_yesterday_umi2 = 'DadosSensores/Umidade/2/{}'.format(data_y)
        # ref_yesterday_umi3 = 'DadosSensores/Umidade/3/{}'.format(data_y)

        # fazendo as query

        dados_temp1 = db.reference(ref_temp1).order_by_key().get()
        dados_temp2 = db.reference(ref_temp2).order_by_key().get()
        dados_temp3 = db.reference(ref_temp3).order_by_key().get()

        # dados_umi1 = db.reference(ref_umi1).order_by_key().get()
        # dados_umi2 = db.reference(ref_umi2).order_by_key().get()
        # dados_umi3 = db.reference(ref_umi3).order_by_key().get()

        # query para pegar ultimo valor dia anterior

        dados_yest_temp1 = db.reference(ref_yesterday_temp1).order_by_key(
        ).limit_to_last(1).get()
        dados_yest_temp2 = db.reference(ref_yesterday_temp2).order_by_key(
        ).limit_to_last(1).get()
        dados_yest_temp3 = db.reference(ref_yesterday_temp3).order_by_key(
        ).limit_to_last(1).get()

        # dados_yest_umi1 = db.reference(ref_yesterday_umi1).order_by_key(
        # ).limit_to_last(1).get()
        # dados_yest_umi2 = db.reference(ref_yesterday_umi2).order_by_key(
        # ).limit_to_last(1).get()
        # dados_yest_umi3 = db.reference(ref_yesterday_umi3).order_by_key(
        # ).limit_to_last(1).get()

        ultimo_valor_temp1 = 0
        ultimo_valor_temp2 = 0
        ultimo_valor_temp3 = 0

        # ultimo_valor_umi1 = 0
        # ultimo_valor_umi2 = 0
        # ultimo_valor_umi3 = 0

        # pegando os ultimos valores e guardando nas variaveis ultimo_valor_*

        for i in dados_yest_temp1:
            for a in dados_yest_temp1[i]:
                ultimo_valor_temp1 = float(dados_yest_temp1[i][a])

        for i in dados_yest_temp2:
            for a in dados_yest_temp2[i]:
                ultimo_valor_temp2 = float(dados_yest_temp2[i][a])

        for i in dados_yest_temp3:
            for a in dados_yest_temp3[i]:
                ultimo_valor_temp3 = float(dados_yest_temp3[i][a])

        # for i in dados_yest_umi1:
        #     for a in dados_yest_umi1[i]:
        #         ultimo_valor_umi1 = float(dados_yest_umi1[i][a])

        # for i in dados_yest_umi2:
        #     for a in dados_yest_umi2[i]:
        #         ultimo_valor_umi2 = float(dados_yest_umi2[i][a])

        # for i in dados_yest_umi3:
        #     for a in dados_yest_umi3[i]:
        #         ultimo_valor_umi3 = float(dados_yest_umi3[i][a])

        vetor_temp1 = {}
        vetor_temp2 = {}
        vetor_temp3 = {}
        # vetor_umi1 = {}
        # vetor_umi2 = {}
        # vetor_umi3 = {}

        # pegando os valores e guardando nos vetores no formato vetor_temp1[hora] = valor

        for i in dados_temp1:
            for a in dados_temp1[i]:
                vetor_temp1[str(i)] = dados_temp1[i][a]

        for i in dados_temp2:
            for a in dados_temp2[i]:
                vetor_temp2[str(i)] = dados_temp2[i][a]

        for i in dados_temp3:
            for a in dados_temp3[i]:
                vetor_temp3[str(i)] = dados_temp3[i][a]

        # for i in dados_umi1:
        #     for a in dados_umi1[i]:
        #         vetor_umi1[str(i)] = dados_umi1[i][a]

        # for i in dados_umi2:
        #     for a in dados_umi2[i]:
        #         vetor_umi2[str(i)] = dados_umi2[i][a]

        # for i in dados_umi3:
        #     for a in dados_umi3[i]:
        #         vetor_umi3[str(i)] = dados_umi3[i][a]

        # criando JSON -----------------------------------------------------------------------
        response = []
        valor_temp1 = ultimo_valor_temp1
        valor_temp2 = ultimo_valor_temp2
        valor_temp3 = ultimo_valor_temp3
        # valor_umi1 = ultimo_valor_umi1
        # valor_umi2 = ultimo_valor_umi2
        # valor_umi3 = ultimo_valor_umi3
        horario = 0
        dicionario = {}
        aux_grava = 1
        # para todos os segundos do dia
        for el in dict_times:
            # se existir dado para algum segundo, atualiza
            if el in vetor_temp1:
                valor_temp1 = float(vetor_temp1[el])
                aux_grava = 1

            if el in vetor_temp2:
                valor_temp2 = float(vetor_temp2[el])
                aux_grava = 1

            if el in vetor_temp3:
                valor_temp3 = float(vetor_temp3[el])
                aux_grava = 1

            # if el in vetor_umi1:
            #     valor_umi1 = vetor_umi1[el]

            # if el in vetor_umi2:
            #     valor_umi2 = vetor_umi2[el]

            # if el in vetor_umi3:
            #     valor_umi3 = vetor_umi3[el]
            if horario == 86399:
                aux_grava = 1

            if aux_grava:
                dicionario = {
                    "Horario:" : horario,
                    "Temperatura 1": valor_temp1,
                    "Temperatura 2": valor_temp2,
                    "Temperatura 3": valor_temp3
                }
                response.append(dicionario)

            #print("\"Hora\":{},\"Temperatura 1\": {},\"Temperatura 2\": {},\"Temperatura 3\": {}".format(
            #    el, valor_temp1, valor_temp2, valor_temp3))
            # response.append("[{},{},{},{},{},{},{}]".format(horario,valor_temp1,valor_temp2,valor_temp3,valor_umi1,valor_umi2,valor_umi3))
            #response.append("\"Temperatura 1\": {},\"Temperatura 2\": {},\"Temperatura 3\": {}".format(
            #    valor_temp1, valor_temp2, valor_temp3))
            horario += 1 #hora em milisegundos, adicionando 1 segundo
            aux_grava = 0

        return response