var User = require('../models/User')

class UserController
{
    async store(data) {
        let user = new User()
        await user.save(data)

        return user
    }
}

module.exports = UserController
