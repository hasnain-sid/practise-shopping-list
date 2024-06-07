const express = require('express');

const task = express.Router();

const {getAllTasks,createTasks,updateTasks,getTasks,deleteTasks} = require('../controller/tasks')
task.route('/').get(getAllTasks).post(createTasks);
task.route('/:id').get(getTasks).patch(updateTasks).delete(deleteTasks);

module.exports = task;