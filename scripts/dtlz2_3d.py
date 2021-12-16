import os
import pickle
import client

dirname = os.path.dirname(__file__)

# Open the optimisation data file
dtlz2_3d_file = open(os.path.join(dirname, 'data/DTLZ2DataFile3D.pkl'), 'rb')
dtlz2_3d_data = pickle.load(dtlz2_3d_file)

# Total population size is 10600
print("Total population size: ", len(dtlz2_3d_data))

populationSize = 100

print("Total generations: ", round(len(dtlz2_3d_data) / populationSize))
totalGenerations = round(len(dtlz2_3d_data) / populationSize)  # 106

# Create an optimiser client
optimiserClient = client.OptimiserClient()

# Algorithm parameters
algorithmParameters = {"Function Evaluations": 10000}

# Create the optimisation run
optimiserClient.createRun("Pareto front estimation of DTLZ2", "DTLZ2",
                          "NGSA-II", populationSize, totalGenerations,
                          algorithmParameters, ["pareto-front"])

# Send generation data to the server
count = 1
data_batch = []
generation = 0
for values in dtlz2_3d_data:
    print(values, count)

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
        generation += 1
        print("Generation: ", generation)
