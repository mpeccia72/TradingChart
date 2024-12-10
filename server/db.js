const Pool = require('pg').Pool;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
    user: 'lebronjames',
    password: redact
    host: redact
    port: 5432,
    database: "lebronjames",
    ssl: true
})

module.exports = pool
