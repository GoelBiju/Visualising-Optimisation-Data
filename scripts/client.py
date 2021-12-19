import json
import queue
import threading

import requests
import socketio

# TODO: Add this to configuration in README
# NOTE: Do not add trailing forward slashes to the URL.
# http://opt-vis-backend.herokuapp.com
# http://localhost:9000
BACKEND_URL = "http://localhost:9000"
# PORT = "33585"
# WEBSOCKET_URL = BACKEND_URL + ":" + PORT
API_URL = BACKEND_URL + "/api"

headers = {"content-type": "application/json"}

# How does it work?
# Run the process queue function in a separate thread/process
# Add data as batches and then send to the backend
# Block any further data being sent from the queue at this time until the server has finished adding it
# Loop until all the data has been added to the queue


class DataNamespace(socketio.ClientNamespace):
    run_id = None
    data_id = None

    sending_data = False
    batch_queue = None
    batch_queue = queue.SimpleQueue()

    def on_connect(self):
        print("connected to backend websocket")

    def on_disconnect(self):
        print("disconnected from backend websocket")

    def on_save(self, data):
        # print(data)
        if (data['saved']):
            self.sending_data = False
        else:
            print("Unable to save data: ", data['message'])

    def initialise_queue(self):
        # Start a thread to send queue data
        threading.Thread(target=self.process_queue).start()
        print("Started process_queue thread")

    def process_queue(self):
        while True:
            if (self.sending_data != True):
                # Get the next batch item
                batch = self.batch_queue.get()

                # Send the data
                data = {
                    "runId": self.run_id,
                    "dataId": self.data_id,
                    "batch": batch
                }
                self.emit("data", data)

                # Prevent any further data being sent
                # until we receive receipt of data from server
                self.sending_data = True


class OptimiserClient():
    sio = None
    # population_size = -1

    data_namespace = None

    def __init__(self):
        # Set population size
        # self.population_size = population_size

        # Create the data namespace
        self.data_namespace = DataNamespace('/data')
        print("Namespace sending data: ", self.data_namespace.sending_data)

        # Connect to node server
        self.sio = socketio.Client(logger=False, engineio_logger=False)
        self.sio.register_namespace(self.data_namespace)
        self.sio.connect(BACKEND_URL)

    # generations
    def createRun(self,
                  title,
                  problem,
                  algorithm,
                  populationSize,
                  totalGenerations,
                  algorithmParameters={},
                  graphs=[],
                  previousData=False):
        # Create a new optimisation run given the parameters
        data = {
            "title": title,
            "problem": problem,
            "algorithm": algorithm,
            "populationSize": populationSize,
            "totalGenerations": totalGenerations,
            "algorithmParameters": algorithmParameters,
            "graphs": graphs,
            "previousData": previousData
        }
        print("Creating optimisation run: ", data)

        # Send the request to create the run
        response = requests.post(API_URL + "/runs",
                                 json.dumps(data),
                                 headers=headers).json()
        print(response)

        if (response["created"] and "runId" in response
                and "dataId" in response):
            # Initialise the queue and provide data id to the data namespace
            self.data_namespace.run_id = response["runId"]
            self.data_namespace.data_id = response["dataId"]
            self.data_namespace.initialise_queue()
            print("Created optimisation run, run ID and data ID received: ",
                  self.data_namespace.data_id, self.data_namespace.run_id)
            print("Sending data: ", self.data_namespace.sending_data)
        else:
            print("Unable to create optimisation run: ", response["message"])

    def addBatch(self, batch_data):
        # Set the new generation and add the data to the queue
        self.data_namespace.batch_queue.put(batch_data)
