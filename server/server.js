const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')
const port = 3000

// middleware
app.use(cors())
app.use(express.json())

// ROUTES

// create user
app.post("/createuser", async(req, res) => {
    try {
        const default_stock = 1
        const {username, password} = req.body
        const newUser = await pool.query("INSERT INTO users (username, password, stock_loaded) VALUES($1, $2, $3)", [username, password, default_stock])
        res.json(newUser)
    } 
    catch(err) {
        console.log(err.message)
        res.send("Username already exists")
    }
})

// update user's stock
app.post("/", async(req, res) => {
    try {
        const {current_stock, user_id} = req.body
        const newUser = await pool.query("UPDATE users SET stock_loaded = ($1) WHERE user_id = ($2)", [current_stock, user_id])
        res.json(newUser)
    } 
    catch(err) {
        console.log(err.message)
        res.send("Username already exists")
    }
})


// fetches last quote of ticker
const fetchLastQuote = async(ticker) => {
    const API_KEY = `https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=LoMtpDajBUfPBxXQHTUdbg9JH887VzFb`
    const response = await fetch (API_KEY)
    const data = await response.json()
    console.log(data[0].price)
    return data[0].price
}


// returns array of ALL stocks
const getSupportedStocks = async() => {
    const supportedStocks = (await pool.query('SELECT ticker from stocks')).rows
    return supportedStocks
}


// adds new or updates existing record of 5 minute timeframe data
const addNewTickData = async(isNewRecord, isLastEntry, currTimestamp) => {

    const stockArray = await getSupportedStocks()

    for (let i = 0; i < stockArray.length; i++) {
        const lastQuote = await fetchLastQuote(stockArray[i].ticker)
        const stock_id = (await pool.query('SELECT stock_id from stocks where ticker = ($1)', [stockArray[i].ticker])).rows[0].stock_id
        console.log(stock_id)

        if(isNewRecord) {
            try {
                await pool.query('INSERT into tickdata (open, high, low, close, stock_id, timestamp) VALUES ($1, $2, $3, $4, $5, $6)', [lastQuote, lastQuote, lastQuote, lastQuote, stock_id, currTimestamp])
            }
            catch (err) {
                console.log(err.message)
            }
        }

        else {
            const currentRecord = await pool.query('SELECT record_id from tickdata WHERE stock_id = ($1) ORDER BY timestamp DESC LIMIT 1', [stock_id])
            const currentRecordId = currentRecord.rows[0].record_id
            const query = 
            await pool.query('SELECT open, high, low, close from tickdata WHERE record_id = ($1)', [currentRecordId])
            const results = query.rows

            const open = results[0].open
            const high = results[0].high
            const low = results[0].low
            const close = results[0].close

            if (lastQuote > high) {
                await pool.query('UPDATE tickdata SET high = ($1) WHERE record_id = ($2)', [lastQuote, currentRecordId])
            }

            if (lastQuote < low) {
                await pool.query('UPDATE tickdata SET low = ($1) WHERE record_id = ($2)', [lastQuote, currentRecordId])
            }

            if(isLastEntry) {
                await pool.query('UPDATE tickdata SET close = ($1) WHERE record_id = ($2)', [lastQuote, currentRecordId])
            }

        } 
       
    }

}


// tracks timestamp and need for record update or creation
const updateTickData = async(seconds) => {
    let day = 1
    seconds += 30
    let timestampStr = `${day}1776${seconds}`
    let timestamp = timestampStr | 0
    let isLastEntry = false
    let isNewEntry = false

    // every 5 minutes
    if(seconds%300 == 0) {
        isNewEntry = true
    }

    // every 4 minutes 30 seconds
    if((seconds + 30)%300 == 0) {
        isLastEntry = true
    }


    await addNewTickData(isNewEntry, isLastEntry, timestamp)

    // 78 five minute candlesticks (6.5 hours of trading, EOD)
    if (seconds != 23100) {
        setTimeout(() => {updateTickData(seconds)}, 30000)
    }

}

// scheduled to start taking data at 8:30 CDT (market open)

    updateTickData(-30);


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})