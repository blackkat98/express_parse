var fs = require('fs')

module.exports = (app, multipartParser) => {
    fs.readdirSync(__dirname).forEach(file => {
        if (file == 'root.js') return

        var name = file.substring(0, file.lastIndexOf('.'))
        require('./' + name)(app, multipartParser)
    })
}
