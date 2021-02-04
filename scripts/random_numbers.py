import random
import time

import socketio

sio = socketio.Client(logger=True, engineio_logger=True)

@sio.event
def connect():
    print("connection established")


@sio.event
def disconnect():
    print("disconnected from server")


def generateDataPoints():
    factor = 1.0
    while sio.connected:
        # load next generation of data (mocked for optimiser)
        dataPoint = {"x": round(random.randint(
            0, 1000) * factor), "y": round(random.randint(0, 1000) * factor)}
        print("Sending data point: ", dataPoint)
        sio.emit("dataPoint", dataPoint, namespace="/data")

        # Sleep a second before sending the next data point
        time.sleep(1)
        factor += 0.1


# Connect to node server
sio.connect("http://localhost:9000", namespaces=['/data'])

# Start sending data points
sio.start_background_task(generateDataPoints)

sio.wait()
