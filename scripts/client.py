import json
import time

import requests
import socketio

BACKEND_URL = "http://localhost:9000"
API_URL = BACKEND_URL + "/api"

headers = {"content-type": "application/json"}


class OptimiserClient():

    # sio = socketio.Client(logger=True, engineio_logger=True)
    sio = None
    data_id = None

    def __init__(self):
        # Connect to node server
        self.sio = socketio.Client(logger=True, engineio_logger=True)
        self.sio.connect(BACKEND_URL, namespaces=['/data'])
        # sio.wait()

    def createRun(self, title, problem, algorithm, populationSize, generations, algorithmParameters={}, graphs=[]):
        # Create a new optimisation run given the parameters
        data = {
            "title": title,
            "problem": problem,
            "algorithm": algorithm,
            "populationSize": populationSize,
            "generations": generations,
            "algorithmParameters": algorithmParameters,
            "graphs": graphs
        }
        print("Creating optmisation run: ", data)

        # Send the request to create the run
        response = requests.post(
            API_URL + "/runs", json.dumps(data), headers=headers).json()
        print(response)

        if (response["created"]):
            self.data_id = response["dataId"]
            print("Created optmisation run, data ID received: ", self.data_id)
        else:
            print("Unable to create optimisation run: ", response["message"])

    # @staticmethod
    # @sio.event
    # def connect():
    #     print("connection established")

    # @staticmethod
    # @sio.event
    # def disconnect():
    #     print("disconnected from server")

    def sendData(self, generation, values):
        if self.sio.connected and self.data_id != None:
            # Send the data
            data = {
                "dataId": self.data_id,
                "generation": generation,
                "values": values
            }
            self.sio.emit("data", data, namespace="/data")
