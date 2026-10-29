// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using settings from environment variables,
// so credentials never live in the code
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.DB_HOST || 'localhost',
    user            : process.env.DB_USER || '',
    password        : process.env.DB_PASSWORD || '',
    database        : process.env.DB_NAME || ''
})

// Export it for use in our application
module.exports.pool = pool;
