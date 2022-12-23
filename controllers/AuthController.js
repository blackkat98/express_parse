const User = require('../models/User')
const UserResource = require('../model_resources/User')
const emailValidator = require('../utils/email_regex')
const responseFormatter = require('../utils/response_formatter')

class AuthController
{
    async signUp(req, res) {
        let inputs = req.body
        let username = inputs.username || null
        let email = inputs.email || null
        let password = inputs.password || null
        let lang = req.header('Accept-Language') || 'en'
        req.i18n.changeLanguage(lang)

        if (!username && !email) {
            return res.status(422).json(responseFormatter(false, null, null, req.t('Username or Email must be provided')))
        }

        if (!password) {
            return res.status(422).json(responseFormatter(false, null, null, req.t('{{field}} is required', {
                field: req.t('Password'),
            })))
        }

        let existingUser = null

        if (username) {
            let query = new Parse.Query(User)
            query.equalTo('username', username)
            existingUser = await query.first({
                useMasterKey: true,
            })

            if (existingUser) {
                return res.status(422).json(responseFormatter(false, null, null, req.t('{{field}} already in use', {
                    field: req.t('Username'),
                })))
            }
        }
        
        if (email) {
            let query = new Parse.Query(User)
            query.equalTo('email', email)
            existingUser = await query.first({
                useMasterKey: true,
            })

            if (existingUser) {
                return res.status(422).json(responseFormatter(false, null, null, req.t('{{field}} already in use', {
                    field: req.t('Email'),
                })))
            }

            username = username || email.split('@').join('-')
        }

        let user = new User()
        user.set('username', username)
        user.set('password', password)
        if (email) user.set('email', email)

        try {
            user = await user.signUp({
                lang: lang,
            })
            user = user.toJSON()

            return res.status(200).json(responseFormatter(true, UserResource.single(user), null, req.t('Registration succeeded')))
        } catch (err) {
            console.error(err)
            // let errorMessage = err.message || req.t('Registration failed')

            return res.status(422).json(responseFormatter(false, null, null, req.t('Registration failed')))
        }
    }

    async signIn(req, res) {
        let inputs = req.body
        let username = inputs.username || inputs.email || null
        let password = inputs.password || null
        let lang = req.header('Accept-Language') || 'en'
        req.i18n.changeLanguage(lang)

        if (!username) {
            return res.status(422).json(responseFormatter(false, null, null, req.t('Username or Email must be provided')))
        }

        if (!password) {
            return res.status(422).json(responseFormatter(false, null, null, req.t('{{field}} is required', {
                field: req.t('Password'),
            })))
        }

        if (emailValidator(username)) {
            let query = new Parse.Query(User)
            query.equalTo('email', username)
            let existingUser = await query.first({
                useMasterKey: true,
            })

            if (!existingUser) {
                return res.status(401).json(responseFormatter(false, null, null, req.t('These credentials do not match our records')))
            }

            existingUser = existingUser.toJSON()
            username = existingUser.username
        }

        try {
            let userInfo = await User.logIn(username, password)
            userInfo = userInfo.toJSON()
            lang = userInfo.lang || 'en'
            req.i18n.changeLanguage(lang)

            return res.status(200).json(responseFormatter(true, UserResource.single(userInfo), null, req.t('Login succeeded')))
        } catch (err) {
            console.log(err)
            let errorMessage = err.message || req.t('Login failed')

            if (errorMessage === 'Invalid username/password.') {
                return res.status(401).json(responseFormatter(false, null, null, req.t('These credentials do not match our records')))
            } else {
                return res.status(500).json(responseFormatter(false, null, null, req.t('Something went wrong')))
            }
        }
    }

    async signOut(req, res) {

    }

    async performOauth(oauthType, oauthId, data) {
        let existingUser = await (new AuthController()).findByOauthInformation(oauthType, oauthId, data)
        let authInfo = null

        if (existingUser) {
            authInfo = await (new AuthController()).signInWithOauthInformation(existingUser, oauthType, oauthId, data)
        } else {
            authInfo = await (new AuthController()).signUpWithOauthInformation(oauthType, oauthId, data)
        }

        return authInfo
    }

    async findByOauthInformation(oauthType, oauthId, data) {
        let oauthQuery = new Parse.Query(User)
        oauthQuery
            .equalTo('oauthType', oauthType)
            .equalTo('oauthId', oauthId)

        let infoQuery = new Parse.Query(User)

        switch (oauthType) {
            case google:
            default:
                infoQuery.equalTo('email', data.email)
                break
        }

        let orQuery = Parse.Query.or(oauthQuery, infoQuery)
        let user = await orQuery.first({
            useMasterKey: true,
        })

        return user
    }

    async signUpWithOauthInformation(oauthType, oauthId, data) {
        let username = null
        let password = process.env.USER_DEFAULT_PASSWORD || 'BetterMe2022@'
        let extraData = {
            oauthId: oauthId,
            oauthType: oauthType,
        }

        switch (oauthType) {
            case 'google':
                // get data from the "_json" field of the response that Google returns
                username = data.email.split('@').join('-')
                extraData.email = data.email
                extraData.name = data.name
                extraData.avatar = data.picture
                break

            default:
                return responseFormatter(false, null, null, 'Unsupported OAuth Provider')
        }

        let user = new User()
        user.set('username', username)
        user.set('password', password)

        try {
            user = await user.signUp(extraData)
            user = user.toJSON()

            return responseFormatter(true, user, null, 'Login succeeded')
        } catch (err) {
            console.error(err)

            return responseFormatter(false, null, null, 'Login failed')
        }
    }

    async signInWithOauthInformation(existingUser, oauthType, oauthId, data) {
        let extraData = {
            oauthId: oauthId,
            oauthType: oauthType,
        }

        switch (oauthType) {
            case 'google':
                // get data from the "_json" field of the response that Google returns
                extraData.name = data.name
                extraData.avatar = data.picture

                break
            default:
                return responseFormatter(false, null, null, 'Unsupported OAuth Provider')
        }

        try {
            await existingUser.save(extraData, {
                useMasterKey: true,
            })
        } catch (err) {
            console.log(err)

            return responseFormatter(false, null, null, 'Something went wrong')
        }

        // temp & experimental
        existingUser = existingUser.toJSON()

        return responseFormatter(true, UserResource.single(existingUser), null, 'Login succeeded')
    }
}

module.exports = AuthController
