const express = require('express')
const morgan = require('morgan')
var app = express()
var socket = require('socket.io')

app.use(morgan('short'))



var server = app.listen(3006, function(){
    console.log("App is up and running, listening on port 3006")
})


app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("Hello World")
})

app.get("/doubleboo", (req, res) => {
    console.log("responding to Boo")
    res.send("Got the BOO")
})

var io = socket(server);

io.on('connection', function(socket){
    console.log("made socket connection", socket.id)

    socket.on('disconnect', function(){
        console.log("Socket connection " + socket.id + " disconnected")
    })
    socket.on('createRoom', function(codeOfRoom){
        console.log("start Create Game func")
        var room = io.sockets.adapter.rooms[codeOfRoom]
        if (room == null){
            socket.join('room' + codeOfRoom, () => {
                console.log('Created room with name: ' + 'room' + codeOfRoom)
                
                /*
                var room = io.sockets.adapter.rooms[gameString]
                io.to(gameString).emit('updateFriendRoom',room.length)
                console.log("Joined Friend Room")
                */
            })

        } else {
            
        }
        
    })

    socket.on('joinRoom', function(codeOfRoom){
        console.log("starting joinRoom")
        var room = io.sockets.adapter.rooms['room' + codeOfRoom]
        if (room != null) {
            socket.join('room' + codeOfRoom, () => {
                console.log('joined room with name: ' + 'room' + codeOfRoom)
                
                /*
                var room = io.sockets.adapter.rooms[gameString]
                io.to(gameString).emit('updateFriendRoom',room.length)
                console.log("Joined Friend Room")
                */
            })

        } else {
            
        }
       
        
    })
    socket.on('sendReaction', function(reactionNum){
        const roomToSend = getRoom(socket)
        io.in(roomToSend).emit('addReaction', reactionNum)
        socket.emit('myMessage',3)
        console.log('sent messages')
    })
    socket.on('message',function(){
        console.log('I got a message!')
        io.emit('my message', 3)
    })
})


function getRoom(incomingSocket) {
    let rooms = Object.keys(incomingSocket.rooms)
    var roomToReturn = undefined
    rooms.forEach(room => {
        //console.log("room to compare is: " + room)
        if (room.includes("room")) {
            console.log("Found room to return")
            roomToReturn = room
        }
    });
    return roomToReturn
}