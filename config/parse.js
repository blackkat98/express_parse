const dbConnection = process.env.DB_CONNECTION || 'mongodb'
const dbHost = process.env.DB_HOST || '127.0.0.1'
const dbPort = process.env.DB_PORT || '27017'
const dbName = process.env.DB_DATABASE || 'dev'
const dbUsername = process.env.DB_USERNAME || ''
const dbPassword = process.env.DB_PASSWORD || ''
const dbCredential = dbUsername ? `${dbUsername}:${dbPassword}@` : ''
const dbUri = `${dbConnection}://${dbCredential}${dbHost}:${dbPort}/${dbName}`

const parseServerConfig = {
    databaseURI: dbUri,
    cloud: '',
    appId: process.env.PARSE_SERVER_APP_ID || 'appId',
    masterKey: process.env.PARSE_SERVER_MASTER_KEY || 'masterKey', // Add your master key here. Keep it secret!
    fileKey: '',  
    serverURL: process.env.PARSE_SERVER_URL || 'http://127.0.0.1:1337/parse', // Don't forget to change to https if needed
    verifyUserEmails: false, // Enable email verification
    publicServerURL: process.env.PARSE_SERVER_PUBLIC_URL || 'http://127.0.0.1:1337/parse', // The public URL of your app. Set the mount path as it is in serverURL.
    port: process.env.PARSE_SERVER_PORT || '1337',
    mount: process.env.PARSE_SERVER_MOUNT || '/parse',
}

const parseDashboardConfig = {
    allowInsecureHTTP: process.env.PARSE_DASHBOARD_INSECURE_HTTP || true,
    apps: [
        {
            serverURL: process.env.PARSE_SERVER_URL || 'http://127.0.0.1:1337/parse',
            appId: process.env.PARSE_SERVER_APP_ID || 'appId',
            masterKey: process.env.PARSE_SERVER_MASTER_KEY || 'masterKey',
            appName: process.env.PARSE_DEFAULT_APP_NAME || 'appName',
            production: false,
        },
    ],
    users: [
        {
            user: 'admin',
            pass: '1',
        },
    ],
    useEncryptedPasswords: false,
    port: process.env.PARSE_DASHBOARD_PORT || '4040',
    mount: process.env.PARSE_DASHBOARD_MOUNT || '/dashboard',
}

module.exports = {
    server: parseServerConfig,
    dashboard: parseDashboardConfig,
}
