// here we have used custom err hand..
// also we have used basic err handlers


const asyncWrapper = require('../middleware/async');
const Task = require('../models/tasks');
const { createCustomError } = require('../errors/custom-error');
const getAllTasks = asyncWrapper( async(req, res) => {
  
    const tasks = await Task.find({})

    res.status(200).json({tasks:tasks});
  
})
const createTasks = asyncWrapper(async (req, res) => {
  console.log(req.body);
    const tasks = await Task.create(req.body)
    res.status(201).json({tasks});
  
});
const getTasks = asyncWrapper (async(req, res,next) => {
  
    const {id: taskId} = req.params
    const task = await Task.findOne({ _id: taskId });
    // if(!task) {
    //   return res.status(404).json({msg:`No task with id: ${taskId}`});
    // }
    if (!task) {
      return next(createCustomError(`No task with id : ${taskId}`, 404))
    }
    res.status(200).json({task: task});
  
   
})


// const getTask = asyncWrapper(async (req, res, next) => {
//   const { id: taskID } = req.params
//   const task = await Task.findOne({ _id: taskID })
//   if (!task) {
//     return next(createCustomError(`No task with id : ${taskID}`, 404))
//   }

//   res.status(200).json({ task })
// })

const updateTasks = async(req, res) => {
  try {
    const {id: taskId} = req.params; 

    const task = await Task.findOneAndUpdate({ _id: taskId },req.body, {
      new:true,
      runValidators:true,
    });

    if(!task) {
      return res.status(404).json({msg:`No task with id: ${taskId}`});
    }
    res.status(200).json({task: task});
  }
  catch (error){
    // for handling cast error
    res.status(500).json({msg: error});
  }
}
const deleteTasks  = async(req, res,next) => {
  try {
    const {id: taskId} = req.params
    const task = await Task.findOneAndDelete({ _id: taskId });
     if(!task) {
      return res.status(404).json({msg:`No task with id: ${taskId}`});
    }
    res.status(200).json({task: task});
  }
  catch (error){
    next(error);
    // for handling cast error
    // res.status(500).json({msg: error});
  }
}
 
module.exports  = {
  getAllTasks,createTasks,getTasks,updateTasks,deleteTasks,
}