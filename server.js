const express  = require('express')
const path = require("path");
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const cors = require("cors")
const { config } = require('dotenv')
config()

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(cors())
app.use("/", (req, res) => {
    res.render('index.html')
})


io.on('connection', socket => {
    socket.emit("map")
    socket.broadcast.emit("map")

    socket.on('data', data => {
        socket.broadcast.emit("synchronize", data)
    })
    socket.on("create", data => {
        socket.broadcast.emit("login", data)
    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`App is running on port ${PORT}`))


