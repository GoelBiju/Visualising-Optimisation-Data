import os
import pickle
import time

import client

dirname = os.path.dirname(__file__)

# Open the optimisation data file
dtlz1_file = open(os.path.join(dirname, 'data/DTLZ1DataFile.pkl'), 'rb')
dtlz1_data = pickle.load(dtlz1_file)

# Population size is 100
# dtlz2_file = open('data/DTLZ2DataFile.pkl', 'rb')
# dtlz2_data = pickle.load(dtlz2_file)

print("Total population size: ", len(dtlz1_data))
# print("Total population size: ", len(dtlz2_data))

populationSize = 100
totalGenerations = 254

# Create an optimiser client
optimiserClient = client.OptimiserClient()

# Algorithm parameters
algorithmParameters = {
    "Function Evaluations": 25000,
    "sbxProb": 0.8,
    "pmProb": 0.1
}

# Create the optimisation run
optimiserClient.createRun("Pareto front estimation of DTLZ1", "DTLZ1",
                          "NGSA-II", populationSize, totalGenerations, algorithmParameters, ["pareto-front"])

# Send generation data to the server
generation = 1
count = 1
# test_data = [[1, 2], [3, 4], [5, 6], [7, 8]]
for values in dtlz1_data:
    print(values, count)
    optimiserClient.sendData(generation, values.tolist())

    if (count < populationSize):
        count += 1
    else:
        generation += 1
        count = 1

print("Completed optimisation run")
