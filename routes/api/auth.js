const AuthController = require('../../controllers/AuthController')
const authController = new AuthController()

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const { google } = require('../../config/oauth')

const expressSession = require('express-session')

passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})
passport.use(new GoogleStrategy(
    {
        clientID: google.clientId,
        clientSecret: google.clientSecret,
        callbackURL: google.callbackUrl || '/oauth/google/callback',
    }, async (req, accessToken, refreshToken, profile, done) => {
        let profileData = profile._json
        let authInfo = await authController.performOauth('google', profileData.sub, profileData)

        return done(null, authInfo)
    }
))

module.exports = (app, multipartParser) => {
    app.use(expressSession({
        secret: 'session_secret',
    }))

    app.post('/signup', multipartParser.none(), authController.signUp)

    app.post('/login', multipartParser.none(), authController.signIn)

    app.get('/oauth/google', passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    }))

    app.get('/oauth/google/callback', passport.authenticate('google', {
        session: false,
    }), async (req, res, next) => {
        const authInfo = req.user
        const lang = authInfo.data && authInfo.data.lang || 'en'
        req.i18n.changeLanguage(lang)
        authInfo.message = req.t(authInfo.message)

        if (authInfo.success) {
            return res.status(200).json(authInfo)
        } else {
            if (authInfo.message == req.t('Something went wrong') || authInfo.message == req.t('Internal server error')) {
                return res.status(500).json(authInfo)
            } else {
                return res.status(401).json(authInfo)
            }
        }
    })
}
