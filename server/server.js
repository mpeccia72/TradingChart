const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')
const bcrypt = require('bcrypt')
const port = 3001

// middleware
app.use(cors())
app.use(express.json())

// ROUTES

// create user
app.post("/createuser", async (req, res) => {
    try {
        const default_stock = 1;
        const { username, password } = req.body;
        console.log(username, password)

        // Check if username already exists
        const userExists = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (userExists.rows.length > 0) {
            return res.status(202).send("Username already exists");
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const newUser = await pool.query(
            "INSERT INTO users (username, password, stock_loaded) VALUES($1, $2, $3) RETURNING *",
            [username, hashedPassword, default_stock]
        );
        const newUserData = await pool.query("SELECT user_id from users where username = ($1)", [username])
        const user_id = newUserData.rows[0].user_id
        const newMember = await pool.query(
            "INSERT INTO memberships (tier_name, max_candlesticks, user_id) VALUES($1, $2, $3) RETURNING *",
            ["FREE", 10, user_id]
        );

        // Respond with the new user (excluding sensitive data like password)
        const { password: _, ...userWithoutPassword } = newUser.rows[0];
        res.status(201).json(userWithoutPassword);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error creating user");
    }
});

app.post("/setStock", async (req,res) => {
    try {
        console.log("activated")
        const {user_id, ticker} = req.body
        const stockIdData = await pool.query('SELECT stock_id from stocks where ticker = ($1)', [ticker])
        const stockId = stockIdData.rows[0].stock_id
        const update = await pool.query('UPDATE users SET stock_loaded = ($1) WHERE user_id = ($2)', [stockId, user_id])
        res.send("CONGRATULATIO")
        console.log(`User: ${user_id} has successfully set their stock to ${ticker}`)
    }
    catch (err) {
        console.log(err)
        console.log(`There was an error with user_id:  selecting stock`)
    }
})

app.get('/mostPopular', async(req,res) => {

    try {
        const data = await pool.query('SELECT stock_loaded, COUNT(*) AS count FROM users GROUP BY stock_loaded ORDER BY count DESC LIMIT 1')
        const stockId = data.rows[0].stock_loaded
        const quantity = data.rows[0].count
        const stockIdData = await pool.query("SELECT * from stocks WHERE stock_id = ($1)", [stockId])

        const info = {
            ticker: stockIdData.rows[0].ticker,
            quantity: quantity
        }

        console.log(info)

        res.json(info)
    }
    catch (err) {
        console.log(err)
    }

})

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (userResult.rows.length === 0) {
            return res.status(202).send("Invalid username or password");
        }

        const user = userResult.rows[0];

        // Compare the provided password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(202).send("Invalid username or password");
        }

        const responseData = {
            "user_id": user.user_id
        }

        res.status(201).json(responseData)

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error logging in");
    }
});

app.post("/getCompanyData", async(req,res) => {
    try {
        const {user_id} = req.body
        console.log(user_id)
        
        const maxCandleSticksData = await pool.query("SELECT stock_loaded from users WHERE user_id = ($1)", [user_id])
        const stockId = maxCandleSticksData.rows[0].stock_loaded

        const stockIdData = await pool.query("SELECT * from stocks WHERE stock_id = ($1)", [stockId])

        const data = {
            name: stockIdData.rows[0].name,
            ticker: stockIdData.rows[0].ticker
        }

        console.log(data)

        res.json(data)
    
    }
    catch {

    }
})

app.post("/getData", async(req,res) => {
    try {
        
        const {user_id} = req.body
        console.log(user_id)
        
        const maxCandleSticksData = await pool.query("SELECT max_candlesticks from memberships WHERE user_id = ($1)", [user_id])
        const maxCandlesticks = maxCandleSticksData.rows[0].max_candlesticks
        
        const stockIdData = await pool.query("SELECT stock_loaded from users WHERE user_id = ($1)", [user_id])
        const stockId = stockIdData.rows[0].stock_loaded

        console.log(`Max candlesticks: ${maxCandlesticks} for stock_id of ${stockId}`)

        const results = await pool.query("SELECT * from tickdata WHERE stock_id = ($1) ORDER BY timestamp DESC LIMIT ($2)", [stockId, maxCandlesticks])
        
        const transformedData = results.rows.map(row => (
            {
                timestamp: row.timestamp,
                open: row.open,
                high: row.high,
                low: row.low,
                close: row.close,
            }
        ))
        res.json(transformedData)
        
    }
    catch(err) {
        console.log(err)
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
    seconds += 90
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