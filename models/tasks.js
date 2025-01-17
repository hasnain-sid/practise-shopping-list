const mongoose = require('mongoose'); 

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,'must provide name'],
    trim : true,
    maxlength: [20, 'give less'],
  }
  ,completed:
  {
    type:Boolean,
    default: false
  } 
})

module.exports = mongoose.model('Task',taskSchema)