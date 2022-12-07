require('./config/env')
require('./modules/parseDashboard')

var express = require('express')
var httpLib = require('http')
var ParseServerModel = require('parse-server').ParseServer
var parseConfig = require('./config/parse')

var bodyParser = require('body-parser') // non-multipart data middleware
var multipartParser = require('multer')() // multipart data middleware

var i18next = require('i18next')
var i18nextMiddleware = require('i18next-http-middleware')
var i18nBackend = require('i18next-fs-backend')

var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true,
}))

i18next
    .use(i18nextMiddleware.LanguageDetector)
    .use(i18nBackend)
    .init({
        initImmediate: false,
        debug: true,
        detection: {
            order: ['querystring', 'cookie'],
            caches: ['cookie'],
        },
        backend: {
            loadPath: __dirname + '/resources/locales/{{lng}}/{{ns}}.json',
            // loadPath: __dirname + '/resources/locales/{{lng}}.json',
            ident: 4,
        },
        lng: 'en',
        preload: ['en', 'vi'],
        saveMissing: false,
        fallbackLng: ['en'],
        ns: [
            'auth',
        ],
        defaultNS: [
            'auth',
        ],
    }, (err, t) => {
        console.log('I18n setup fallback')
    })

app.use(i18nextMiddleware.handle(i18next))

var parseServer = new ParseServerModel(parseConfig.server)
app.use(parseConfig.server.mount, parseServer)

var httpServer = httpLib.createServer(app)
httpServer.listen(parseConfig.server.port)

ParseServerModel.createLiveQueryServer(httpServer)

require('./routes/api/root')(app, multipartParser)
