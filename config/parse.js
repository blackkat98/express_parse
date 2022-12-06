const env = require('./env')
const envConfig = require('./env')

const dbConnection = envConfig.PARSE_SERVER_DB_CONNECTION || 'mongodb'
const dbHost = envConfig.PARSE_SERVER_DB_HOST || '127.0.0.1'
const dbPort = envConfig.PARSE_SERVER_DB_PORT || '27017'
const dbName = envConfig.PARSE_SERVER_DB_DATABASE || 'dev'
const dbUsername = envConfig.PARSE_SERVER_DB_USERNAME || ''
const dbPassword = envConfig.PARSE_SERVER_DB_PASSWORD || ''
const dbCredential = dbUsername ? `${dbUsername}:${dbPassword}@` : ''
const dbUri = `${dbConnection}://${dbCredential}${dbHost}:${dbPort}/${dbName}`

const parseServerConfig = {
    databaseURI: dbUri,
    cloud: '',
    appId: envConfig.PARSE_SERVER_APP_ID || '',
    masterKey: envConfig.PARSE_SERVER_MASTER_KEY || '', // Add your master key here. Keep it secret!
    fileKey: '',  
    serverURL: envConfig.PARSE_SERVER_URL || 'http://127.0.0.1:1337/parse', // Don't forget to change to https if needed
    verifyUserEmails: false, // Enable email verification
    publicServerURL: envConfig.PARSE_SERVER_PUBLIC_URL || 'http://127.0.0.1:1337/parse', // The public URL of your app. This will appear in the link that is used to verify email addresses and reset passwords. Set the mount path as it is in serverURL.
    port: envConfig.PARSE_SERVER_PORT || '1337',
    mount: envConfig.PARSE_SERVER_MOUNT || '/parse',
}

const parseDashboardConfig = {
    allowInsecureHTTP: envConfig.PARSE_DASHBOARD_INSECURE_HTTP || true,
    apps: [],
    users: [
        {
            username: 'admin',
            password: '1234',
        }
    ],
    useEncryptedPasswords: false,
    port: envConfig.PARSE_DASHBOARD_PORT || '4040',
    mount: envConfig.PARSE_DASHBOARD_MOUNT || '/dashboard',
}

module.exports = {
    server: parseServerConfig,
    dashboard: parseDashboardConfig,
}
