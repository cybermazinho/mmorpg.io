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

let messages = []


io.on('connection', socket => {
    
    socket.emit("map_player")
    socket.broadcast.emit("map_player")
    socket.emit('messages', messages)
   
    socket.on("created_player", data => {
        socket.broadcast.emit("login", data)
    })
    socket.on('move_player', data => {
        socket.broadcast.emit("synchronize", data)
    })

    socket.on('message', data => {
        messages.length >=15 ? messages = [] : messages
        messages.push(data)
        socket.emit('messages', messages)
        socket.broadcast.emit('messages', messages)
    })

    socket.on("stop", data =>{
        socket.broadcast.emit("stopando", data)
    })

})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`App is running on port ${PORT}`))


