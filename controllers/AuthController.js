const User = require('../models/User')
const UserResource = require('../model_resources/User')
const emailValidator = require('../utils/email_regex')
const responseFormatter = require('../utils/response_formatter')

class AuthController
{
    async findByOauthInformation(oauthId, oauthProvider) {
        let query = new Parse.Query(User)
        query
            .equalTo('oauthId', oauthId)
            .equalTo('oauthProvider', oauthProvider)

        try {
            let user = await query.first({
                useMasterKey: true,
            })

            return user || null
        } catch (err) {
            console.error(err)

            return null
        }
    }

    async signUp(data) {
        let user = new User()
        user.set('username', data.username)
        user.set('password', data.password || process.env.USER_DEFAULT_PASSWORD)

        try {
            user = await user.signUp({
                email: data.email || undefined,
                name: data.name || null,
                oauthType: data.oauthType || null,
                oauthId: data.oauthId || null,
            })

            return user
        } catch (err) {
            console.error(err)

            return null
        }
    }

    async logIn(data) {
        let username = data.username || data.email
        let password = data.password

        if (emailValidator(username)) {
            let query = new Parse.Query(User)
            query.equalTo('email', username)
            let user = await query.first({
                useMasterKey: true,
            })

            if (!user) {
                return null
            }

            user = user.toJSON()
            username = user.username
        }

        // return new Promise((resolve, reject) => {
        //     User.logIn(username, password)
        //         .then(user => {
        //             resolve(user)
        //         })
        //         .catch(err => {
        //             console.error(err)
        //             resolve(null)
        //         })
        // })

        try {
            let userInfo = await User.logIn(username, password)
            userInfo = userInfo.toJSON()

            return responseFormatter(true, UserResource.single(userInfo), null, '')
        } catch (err) {
            console.error(err)

            return responseFormatter(false, null, true, err.message || '')
        }

        // User.logIn(reqData.username, reqData.password).then(user => {
        //     return res.status(200).json({
        //         success: true,
        //         code: 200,
        //         message: req.t('log_in_success'),
        //         data: user,
        //     })
        // }).catch(err => {
        //     return res.status(500).json({
        //         success: false,
        //         code: 500,
        //         message: req.t('log_in_failure'),
        //         data: null,
        //     })
        // })
    }
}

module.exports = AuthController
