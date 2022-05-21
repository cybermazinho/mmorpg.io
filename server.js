const express  = require('express')
const path = require("path");
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const cors = require("cors")
config()

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(cors())
app.use("/", (req, res) => {
    res.render('index.html')
})

let dataBase = []

io.on('connection', socket => {
    socket.emit("synchronize", dataBase)
    socket.broadcast.emit("synchronize", dataBase)
    socket.on("login", data => {
        dataBase.push(data)
        socket.emit("synchronize", dataBase)
        socket.broadcast.emit("synchronize", dataBase)
    })
    socket.on("update", data => {
        dataBase = data;
        socket.emit("synchronize", dataBase)
        socket.broadcast.emit("synchronize", dataBase)
    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`App is running on port ${PORT}`))


