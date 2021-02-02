import json
import time

import requests
import socketio

BACKEND_URL = "http://localhost:9000"
API_URL = BACKEND_URL + "/api"

sio = socketio.Client(logger=True, engineio_logger=True)

headers = {"content-type": "application/json"}


def createRun(title, problem, algorithm, populationSize, generations, algorithmParameters={}, graphs=[]):
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
    response = requests.post(
        API_URL + "/runs", json.dumps(data), headers=headers)
    print(response.content)


@sio.event
def connect():
    print("connection established")


@sio.event
def disconnect():
    print("disconnected from server")


# def generateDataPoints():
#     factor = 1.0
#     while sio.connected:
#         # load next generation of data (mocked for optimiser)
#         dataPoint = {"x": round(random.randint(
#             0, 1000) * factor), "y": round(random.randint(0, 1000) * factor)}
#         print("Sending data point: ", dataPoint)
#         sio.emit("dataPoint", dataPoint, namespace="/data")

#         # Sleep a second before sending the next data point
#         time.sleep(1)
#         factor += 0.1


# sio.connect(BACKEND_URL, namespaces=['/data'])


# Start sending data points
# sio.start_background_task(generateDataPoints)

# sio.wait()
