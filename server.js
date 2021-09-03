const express = require('express')
const cors = require("cors")
const helmet = require('helmet')
const csurf = require('csurf')
const morgan = require('morgan')
const ratelimit = require('express-rate-limit')
const https = require('https')
const fs = require('fs')

const app = express()

const limiter = ratelimit({
    windowMs: 300000,
    max: 100
})

app.use(helmet())
app.use(limiter)
app.use(morgan('short'))
app.use(express.static(__dirname + "/web/"))
app.use(cors())


app.get('/', csurf({cookie:true}), function(req, res) {
    res.sendFile("/web/index.html", {root: __dirname})
})

const httpsServ = https.createServer({
    key: fs.readFileSync("./private/notjacob.key"),
    cert: fs.readFileSync("./private/notjacob.crt")
}, app)

if (process.argv[2] == "https") {
    httpsServ.listen(443, () => {
        console.log("server up on https")
    })
} else if (process.argv[2] == "http" || !process.argv[2]) {
    app.listen(80, () => {
        console.log("server up on http")
    })
}
