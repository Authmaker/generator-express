# @authmaker/generator-express [![Build Status](https://magnum.travis-ci.org/authmaker/generator.png?branch=master)](https://travis-ci.org/authmaker/generator)

> [Yeoman](http://yeoman.io) generator


## Getting Started

If you don't know Yeoman go read up on it [here](http://yeoman.io/) or just follow the instructions below, what's the worse that can happen!?


### Installing

Check if you have yeoman installed with `yo --version` if not use this:

```bash
npm install -g yo
```

We will soon be updating this package to use npm private modules but for now install using the following

```bash
npm install -g @authmaker/generator-express
```

Create the folder that you want to be a project, cd into that folder and run the following:

```bash
yo @authmaker/express
```

### Available generators

The default generator will get you started with a boilerplate application. Once you have that application up and running you can use some of the following commands to add key features

#### Test System

*to be documented*

#### Background Tasks

```bash
yo @authmaker/express:background-tasks
```

The background tasks system uses [Kue](https://github.com/Automattic/kue) and allows you to have a new file per each job type available in your system.

You will also be asked if you want to add a cron system which will use [node-cron](https://github.com/kelektiv/node-cron). This is intended to allow you to create Kue tasks at regular intervals.

## License

All Rights Reserved © Chris Manson <chris@manson.ie>
