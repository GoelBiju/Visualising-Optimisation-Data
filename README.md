# Visualising Optimisation Data

This is the COMP3000 Computing Project on the topic of creating "A Web Platform for Visualising Optimisation Data".

**Project Supervisor**: _Dr. David Walker_

## Poster

![Project poster](documents/poster.jpg)

## Project Vision

This project aims to develop a “Web Platform for Visualising Optimisation Data”, for
evolutionary computation research at the University of Plymouth, to visualise aspects of optimisation data that is generated from evolutionary algorithms.

The web platform will provide:

- the ability for the optimisation data collected from client optimisers to be visualised in real-time,
- the playback of saved optimisation runs,
- a deployed web platform acting as a single tool which collects all appropriate visualisations for optimisation runs.

A demonstration of the project is available on [YouTube](https://www.youtube.com/watch?v=7goXb3EpkKE).

## Installation

The following pieces of software is needed to be installed on your machine before proceeding with the instructions below to set up a local development environment:

- NodeJS (https://nodejs.org/en/)
- MongoDB (https://www.mongodb.com/try/download/community)
- Yarn (installed through NPM from NodeJS, see https://yarnpkg.com/)
- Python 3.8.10 (https://yarnpkg.com/) (for running the client optimiser scripts); ensure that python and pip is added to environment variables (for Windows) and that it can be called from the command line/terminal

Once the required software has been installed, you can proceed with setting up the codebase and installing packages:

1. Clone the repository from GitHub using the following command:

```bash
git clone https://github.com/GoelBiju/Visualising-Optimisation-Data.git
```

2. Install the packages required for the frontend and plugins:

```bash
yarn install
```

3. Install the packages required for the backend by changing the directory into the backend and using the following command:

```bash
cd backend && yarn install
```

## Optimiser Client

The examples provided make use of Python 3.8.10.

To run and test the sample data already provided, install the Python dependencies in the root of the project:

```bash
pip install -r requirements.txt --user

```

The scripts are in the "/scripts" folder, you can run from them the root with the following:

Run DTLZ1:

```bash
python scripts/dtlz1.py
```

Run DTLZ2:

```bash
python scripts/dtlz2.py
```

## Plugins

To create a plugin you can copy any of the existing plugins in the `packages` folder.

To configure the plugin to work with the frontend, you will need to set its name and description through the files in the plugin folder:

1. `webpackConfig.output.library` in `craco.config.js` to the plugin name,

2. `settings.json/deploy-settings.json` to add the plugin details (look at examples already provided),

3. `name` in `package.json` of the plugin project,

4. `div` id in `index.html` in public folder of plugin project to identify where the plugin will load,

5. `registerRouteAction` in `src/App.tsx` for the plugin and provide additional plugin details,

6. `pluginName` in `src/index.tsx`,

7. `plugins` command in `package.json` to add the plugin to start with the command,

8. web dyno start in `Procfile` for plugin project (if you are using Heroku).

## Deploying backend to Heroku

You will need to create a backend application on Heroku and add the GitHub repository to it.

The backend requires you to make use of an external MongoDB service. For this reason you will need to specify a "MONGODB_URI" configuration key in the config vars in Heroku settings for the backend application. You could use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and get a URI to access a database on a cluster.

The backend application does not require any further configuration and uses the default "heroku/nodejs" buildpack which will automatically be recognised when the application is first deployed which triggers `npm start` on its web dyno.

## Deploying frontend and plugins to Heroku

The Heroku deployment is not necessary if the project is to be hosted elsewhere,
but, if you want to host on Heroku then you will need to make use of the [Heroku multi-procfile buildpack](https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-multi-procfile).

1. Create your apps for the frontend and plugins,

2. Ensure you connect the GitHub repository to the frontend and plugin apps,

3. For each of the apps you will need to add the multi-procfile buildpack and the node.js buildpack if it is already not present,

4. In the frontend application add a "PROCFILE" configuration key with the value indicating the location of the frontend Procfile with respect to the repository root (e.g. packages/frontend/Procfile),

5. In the frontend application add a "REACT_APP_SETTINGS" key with the value of the name of the settings.json which will be used in the deployed environment (i.e. Heroku) e.g. this can be set to the default "deploy-settings.json",

6. For each plugin application add a "PROCFILE" configuration key and set the value to the location of the Procfile for the plugin (with respect to the project root) e.g. packages/pareto-front/Procfile or packages/line/Procfile

After this has been set up the application should be deployed from the main branch of the repository.

## Deployments

Frontend: http://opt-vis-frontend.herokuapp.com/

Backend: http://opt-vis-backend.herokuapp.com/
