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
    run_id = None

    def __init__(self):
        # Connect to node server
        sio = socketio.Client(logger=True, engineio_logger=True)
        sio.connect(BACKEND_URL, namespaces=['/data'])
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
            self.run_id = response["runId"]
            print("Created optmisation run with ID: ", self.run_id)
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
        if self.sio.connected:
            # Send the data
            data = {
                "runId": self.run_id,
                "generation": generation,
                "values": values
            }
            self.sio.emit("data", data, namespace="/data")
