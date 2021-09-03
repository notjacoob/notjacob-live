const express = require('express')
const cors = require("cors")
const https = require('https')
const fs = require('fs')

const app = express()

app.use(express.static(__dirname + "/web/"))
app.use(cors())

app.get('/', function(req, res) {
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
