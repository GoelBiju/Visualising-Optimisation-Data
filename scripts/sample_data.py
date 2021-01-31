import pickle
import time

# import socketio

# Open the optimisation data file
dtlz1_file = open('data/DTLZ1DataFile.pkl', 'rb')
dtlz1_data = pickle.load(dtlz1_file)

# Population size is 100
# dtlz2_file = open('data/DTLZ2DataFile.pkl', 'rb')
# dtlz2_data = pickle.load(dtlz2_file)

print("Total population size: ", len(dtlz1_data))
# print("Total population size: ", len(dtlz2_data))

print(dtlz1_data[len(dtlz1_data) - 101: len(dtlz1_data) - 1])

# sio = socketio.Client(logger=True, engineio_logger=True)

# @sio.event
# def connect():
#     print("Connection to server")

# @sio.event
# def disconnect():
#     print("Disconnected from server")

# def sendData():


# Connect to node server
# sio.connect("http://localhost:9000", namespaces=['/data'])

# Start sending data points
# sio.start_background_task(sendData)

# sio.wait()
