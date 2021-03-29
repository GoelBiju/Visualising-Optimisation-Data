import os

import matplotlib.pyplot as plt
import numpy as np

import client

dirname = os.path.dirname(__file__)

# optimiserClient = client.OptimiserClient()


def get_pathname(path):
    return os.path.join(dirname, path)


def generatePopulation(N, P):
    """
    Generate a random population of solutions to the OneMax problem.
    """
    return np.random.randint(0, 2, (N, P))


def evaluate(x):
    """
    Evaluate the solution's fitness according to the OneMax fitness
    function.
    """
    return x.sum()


def crossover(x1, x2):
    """
    Single-point crossover operator.
    """
    P = x1.shape[0]
    idx = np.random.randint(P)  # Pick crossover point at random.
    return np.concatenate((x1[:idx], x2[idx:]))


def mutate(x):
    """
    Flip each bit with probability 1/P.
    """
    P = x.shape[0]
    I = np.nonzero(np.random.rand(P) < (1/P))[0]
    x[I] = abs(x[I]-1)
    return x


def ga(N, P, ngens):
    """
    Use a GA to solve the OneMax problem. Run the algorithm for the 
    specified number of generations and return the best solution at
    the end.
    """
    # Generate a population.
    X = generatePopulation(N, P)
    Y = np.array([evaluate(X[i]) for i in range(N)])

    # Keep a list of the fitnesses at each generation.
    # Create fitness array with N rows and ngens columns ()
    Ys = np.zeros((N, ngens))

    for gen in range(ngens):
        # print(gen)

        Xp = np.zeros((N, P))
        Yp = np.zeros(N)
        for i in range(N):
            # Pick two solutions at random.
            j, k = np.random.permutation(N)[:2]
            Xp[i] = crossover(X[j], X[k])       # Cross the two solutions.
            Xp[i] = mutate(Xp[i])               # Mutate the new child.
            Yp[i] = evaluate(Xp[i])             # Compute the child's fitness.

        # Select the best N solutions to be the parents in the next generation.
        # Combine the two populations for
        Zx = np.concatenate((X, Xp), axis=0)
        Zy = np.concatenate((Y, Yp), axis=0)    # selection.

        I = np.argsort(1 / Zy)                  # We're maximising, and argsort
        X = Zx[I[:N]]                           # minimises, so invert the
        Y = Zy[I[:N]]                           # fitnesses with 1 / Zy.

        # print(Y)
        Ys[:, gen] = Y

        # Send the population
        print(Y.tolist())
        # optimiserClient.addBatch(Y.tolist())

    # Return the best solution.
    idx = np.argmax(Y)
    return X[idx, :], Y[idx], Ys


def experiment(N, P, ngens):
    """
    Run an experiment with the parametrisation specfied.
    """
    x, y, Ys = ga(N, P, ngens)
    # print("Fitness: ", Ys)
    # print(np.median(Ys[0]))
    # print("Median: ", np.median(Ys, axis=0))

    plt.figure()
    plt.axhline(P, 0, ngens, linestyle="--", color="k")
    plt.plot(np.median(Ys, axis=0))
    plt.fill_between(np.arange(ngens), np.min(Ys, axis=0),
                     y2=np.max(Ys, axis=0), alpha=0.5)
    plt.xlabel("Generation")
    plt.ylabel("$f(x)=\\sum^P_{p=1}x_p$")
    plt.xticks((np.arange(5)*(ngens/4)).astype(int),
               (np.arange(5)*(ngens/4)).astype(int))
    plt.xlim(0, ngens)
    plt.ylim(0, P+max(1, np.ceil(P/10)))


if __name__ == "__main__":
    # Create our run
    # optimiserClient.createRun("OneMax", "OneMax", "GA", 100, 1000, {
    #                           "P": 800}, graphs=["line"])

    # Run the GA.
    # Experiment (population size, probability, total generations)
    experiment(10, 8, 20)
    plt.savefig(get_pathname("figs/ga_10_8_20.pdf"), bbox_inches="tight")

    # experiment(10, 800, 20)
    # plt.savefig(get_pathname("figs/ga_10_800_20.pdf"), bbox_inches="tight")

    # experiment(10, 800, 1000)
    # plt.savefig(get_pathname("figs/ga_10_800_1000.pdf"), bbox_inches="tight")

    # experiment(100, 800, 1000)
    # plt.savefig(get_pathname("figs/ga_100_800_1000.pdf"), bbox_inches="tight")

    print("Finished experiment")
    plt.show()
