import random
import time

import socketio

sio = socketio.Client(logger=True, engineio_logger=True)

# TODO: How to handle a message from the server.


@sio.event
def connect():
    print("connection established")


@sio.event
def disconnect():
    print("disconnected from server")


# @sio.on('data', namespace="/frontend")
# def on_data(data):
#     print("Received frontend data: ", data)


def generateDataPoints():
    while sio.connected:
        # load next generation of data (mocked for optimiser)
        dataPoint = {"x": random.randint(
            0, 1000), "y": random.randint(0, 1000)}
        print("Sending data point: ", dataPoint)
        sio.emit("dataPoint", dataPoint, namespace="/data")

        # Sleep a second before sending the next data point
        time.sleep(1)


# Connect to node server
sio.connect("http://localhost:9000", namespaces=['/data'])

# Start sending data points
sio.start_background_task(generateDataPoints)

sio.wait()
