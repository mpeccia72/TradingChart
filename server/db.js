const Pool = require('pg').Pool;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
    user: 'lebronjames',
    password: "gloriousking!",
    host: "trading-chart-webapp-db.cvkkg84qkvgj.us-east-2.rds.amazonaws.com",
    port: 5432,
    database: "lebronjames",
    ssl: true
})

module.exports = pool
