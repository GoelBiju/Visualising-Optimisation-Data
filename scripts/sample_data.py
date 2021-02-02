import pickle
import time

import client

# Open the optimisation data file
dtlz1_file = open('data/DTLZ1DataFile.pkl', 'rb')
dtlz1_data = pickle.load(dtlz1_file)

# Population size is 100
# dtlz2_file = open('data/DTLZ2DataFile.pkl', 'rb')
# dtlz2_data = pickle.load(dtlz2_file)

print("Total population size: ", len(dtlz1_data))
# print("Total population size: ", len(dtlz2_data))

print(dtlz1_data[len(dtlz1_data) - 101: len(dtlz1_data) - 1])

client.createRun("Pareto front estimation of DTLZ1",
                 "DTLZ1", "NGSA-II", 100, 254)
