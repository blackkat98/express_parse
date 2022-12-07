process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
const envMode = process.env.NODE_ENV
require('custom-env').env(envMode)
