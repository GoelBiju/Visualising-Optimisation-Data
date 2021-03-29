# Visualising Optimisation Data

This is the COMP3000 Computing Project on the topic of creating "A Web Platform for Visualising Optimisation Data".

**Project Supervisor**: _Dr. David Walker_

## Project Vision

This project aims to develop a “Web Platform for Visualising Optimisation Data”, for
evolutionary computation research at the University of Plymouth, to visualise aspects of optimisation data that is generated from evolutionary algorithms.

The web platform will provide:

- the ability for the optimisation data collected from client optimisers to be visualised in real-time,
- the playback of saved optimisation runs,
- a deployed web platform acting as a single tool which collects all appropriate visualisations for optimisation runs.

## Installation

## Optimiser Client

The examples provided make use of Python 3.9.

To run and test the sample data already provided, install the Python dependencies in the root of the project:

```bash
pip install -r requirements.txt --user

```

The scripts are in the /scripts folder, you can run from them the root with the following:

Run DTLZ1:

```bash
python scripts/dtlz1.py
```

Run DTLZ2:

```bash
python scripts/dtlz2.py
```

## Plugins

To configure a plugin give a specific name you will have to change:

1. `webpackConfig.output.library` in `craco.config.js` to the plugin name,

2. `settings.json/deploy-settings.json` to add the plugin details (look at examples already provided),

3. `name` in `package.json` of the plugin project,

4. `div` id in `index.html` in public folder of plugin project to identify where the plugin will load,

5. `registerRouteAction` in `src/App.tsx` for the plugin and provide additional plugin details,

6. `pluginName` in `src/index.tsx`,

7. `plugins` command in `package.json` to add the plugin to start with the command,

8. web dyno start in `Procfile` for plugin project (if you are using Heroku).

## Deployments

Frontend: http://opt-vis-frontend.herokuapp.com/

Backend: http://opt-vis-backend.herokuapp.com/
