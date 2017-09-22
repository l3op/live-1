const mongoose = require('mongoose')
const validate = require('mongoose-validator');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

var nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [2, 300],
    message: 'Your name should be more than 2 characters.'
  })
]
var emailValidator = [
  validate({
    validator: 'matches',
    message: 'This email is invalid.',
    arguments: /\S+@\S+\.\S+/
  })
]
var passwordValidator = [
  validate({
    validator: 'isLength',
    message: 'Your password must have at least 6 characters',
    arguments: [6, 300]
  })
]

var UserSchema = new mongoose.Schema({
  fullname: {type: String, required: true, trim: true, validate: nameValidator},
  password: {type: String, required: true, trim: true, validate: passwordValidator},
  email: {type: String, required: true, trim: true, validate: emailValidator},
  _followings: [{type: Schema.Types.ObjectId, ref: 'User'}],
  _followers: [{type: Schema.Types.ObjectId, ref: 'User'}],
  _lives: [{type: Schema.Types.ObjectId, ref: 'Live'}],
  _attending: [{type: Schema.Types.ObjectId, ref: 'Live'}],
  interests: [{
    type: String,
    enum: ['Tech', 'Food', 'Love', 'Family', 'Music', 'Nature', 'Coding', 'Fitness', 'Others'],
    trim: true,
    default: 'Others'
  }],
  _feeds: [{type: Schema.Types.ObjectId, ref: 'Post'}]
}, {timestamps: true})
// UserSchema.methods.hash_password = function (password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
// }
// UserSchema.pre('save', function (done) {
//   this.password = this.hash_password(this.password)
//   done()
// })


var LiveSchema = new mongoose.Schema({
  _user: {type: Schema.Types.ObjectId, ref: 'User'},
  title: {type: String},
  image: {type: String},
  location: {type: String},
  city: {type: String},
  date_time: {type: String},
  latitude: {type: String},
  longitude: {type: String},
  interests: [{
    type: String,
    enum: ['Tech', 'Food', 'Love', 'Family', 'Music', 'Nature', 'Coding', 'Fitness', 'Others'],
    trim: true,
    default: 'Others'
  }],
  _attendees: [{type: Schema.Types.ObjectId, ref: 'User'}],
  _feeds: [{type: Schema.Types.ObjectId, ref: 'Post'}]
}, {timestamps: true})

var PostSchema = new mongoose.Schema({
  content: {type: String},
  _user: {type: Schema.Types.ObjectId, ref: 'User'},
  _live: {type: Schema.Types.ObjectId, ref: 'Live'}
}, {timestamps: true})

mongoose.model('User', UserSchema)
mongoose.model('Live', LiveSchema)
mongoose.model('Post', PostSchema)
