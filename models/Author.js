const mongoose = require('mongoose')

const AuthorSchema = new mongoose.Schema({
  _authName: {
    type: String,
    required: [true, 'must provide name'],
    trim: true,
    
  },
  _year: {
    type: Array,
    required: [false],
    
  },
  _dblp_id:{
    type:String,
    required: [true,'must provide'],

  },
  _email:{
    type:String,
    required: [true,'must provide email'],

  },
  _pub:{
    type:Number,
    required: [true],

  }
},{bufferCommands:false,
autoCreate:false})

module.exports = mongoose.model('Author', AuthorSchema)
