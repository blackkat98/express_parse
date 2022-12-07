module.exports = {
    google: {
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
        callbackUrl: process.env.GOOGLE_OAUTH_CALLBACK_URL || '',
    },
}
