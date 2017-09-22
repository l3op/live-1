var express = require('express')
var body_parser = require('body-parser')
var path = require('path')
var session = require('express-session')
var file_upload = require('express-fileupload')
var app = express()
app.use(session({secret: 'God is the only key', resave: true, saveUninitialized: true}))
app.use(body_parser.urlencoded({extended: true}))
app.use(body_parser.json())
app.use(file_upload())
app.use(express.static(path.join(__dirname, '/static'))) //images
app.use(express.static(path.join(__dirname, './client/dist'))) //angular


require('./server/config/mongoose.js')
require('./server/config/routes.js')(app)


const server = app.listen(8000) 

require('./server/controllers/socket.js')(server)
