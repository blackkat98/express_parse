var express = require('express')
var httpLib = require('http')
var ParseDashboardModel = require('parse-dashboard')
var parseConfig = require('../config/parse')

var app = express()

var parseDashboard = new ParseDashboardModel(parseConfig.dashboard, parseConfig.dashboard.allowInsecureHTTP)
app.use(parseConfig.dashboard.mount, parseDashboard)

var httpServer = httpLib.createServer(app)
httpServer.listen(parseConfig.dashboard.port)
