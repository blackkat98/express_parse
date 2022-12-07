const AuthController = require('../../controllers/AuthController')
const authController = new AuthController()
const UserResource = require('../../model_resources/User')
const userResource = new UserResource()

const oAuthConfig = require('../../config/oauth')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(new GoogleStrategy(
    {
        clientID: oAuthConfig.google.clientId,
        clientSecret: oAuthConfig.google.clientSecret,
        callbackURL: oAuthConfig.google.callbackUrl || '/oauth/google/callback',
    }, async (req, accessToken, refreshToken, profile, done) => {
        let profileData = profile._json
        let existingUser = await authController.findByOauthInformation(profileData.sub, 'google')

        if (!existingUser) {
            let data = {
                username: profileData.email.split('@')[0],
                email: profileData.email,
                name: profileData.name,
                password: '',
                oauthType: 'google',
                oauthId: profileData.sub,
            }

            let user = await authController.signUp(data)

            return done(null, user)
        } else {

        }
    }
))


module.exports = (app, multipartParser) => {
    app.post('/signup', multipartParser.none(), async (req, res, next) => {

    })

    app.post('/login', multipartParser.none(), async (req, res, next) => {
        let userInfo = await authController.logIn(req.body)
        let lang = req.header('Accept-Language') || 'en'
        req.i18n.changeLanguage(lang)
        userInfo.message = req.t(userInfo.message || '')

        if (userInfo.success) {
            return res.status(200).json(userInfo)
        } else {
            return res.status(401).json(userInfo)
        }
    })

    app.get('/oauth/google', passport.authenticate('google', {
        scope: ['profile', 'email'],
    }))

    app.get('/oauth/google/callback', passport.authenticate('google'), () => {
        
    })
}
