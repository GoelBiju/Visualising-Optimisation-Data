import os
import pickle
import time

import client

dirname = os.path.dirname(__file__)

# Open the optimisation data file
dtlz2_file = open(os.path.join(dirname, 'data/DTLZ2DataFile.pkl'), 'rb')
dtlz2_data = pickle.load(dtlz2_file)

# Population size is 100
# print("Total population size: ", len(dtlz2_data))

populationSize = 100
totalGenerations = 54

# Create an optimiser client
optimiserClient = client.OptimiserClient()  # populationSize

# Algorithm parameters
algorithmParameters = {
    "Function Evaluations": 5000,
    "sbxProb": 0.8,
    "pmProb": 0.1
}

# Create the optimisation run
optimiserClient.createRun("Pareto front estimation of DTLZ2", "DTLZ2",
                          "NGSA-II", populationSize, totalGenerations, algorithmParameters, ["pareto-front"])

# Send generation data to the server
count = 1
data_batch = []
for values in dtlz2_data:
    # Add the data to the batch to send
    data_batch.append(values.tolist())

    if (count < populationSize):
        count += 1
    else:
        # Add the data to the client queue to send
        # print("Sending generation: ", generation)
        optimiserClient.addBatch(data_batch)
        data_batch = []

        count = 1
        # print("Next Generation: ", generation)

print("Completed adding items to queue, wait until queue has been processed")
