var express = require('express')
var httpLib = require('http')
var ParseServerModel = require('parse-server').ParseServer
var parseConfig = require('../config/parse')

var app = express()

var parseServer = new ParseServerModel(parseConfig.server)
app.use(parseConfig.server.mount, parseServer)

var httpServer = httpLib.createServer(app)
httpServer.listen(parseConfig.server.port)

ParseServerModel.createLiveQueryServer(httpServer)
