const express=require('express')
const http=require('http')
const {Server}=require('socket.io')

const app=express()
const server=http.createServer(app)
const io=new Server(server)
let players={}
app.use(express.static('public'))


io.on('connection',(socket)=>{
    console.log("A user connected:",socket.id)
    players[socket.id]={x:0,y:0}


    socket.broadcast.emit('playerConnected',{id:socket.id,position:players[socket.id]})

    socket.on('move',(data)=>{
        console.log('Player moved:', data);
        if (players[socket.id]) {
            players[socket.id].x+=data.dx
            players[socket.id].y+=data.dy

            socket.broadcast.emit('playerMoved',{id:socket.id,position:players[socket.id]})
            
        }
    })
    socket.on('disconnect',()=>{
        console.log('User disconnected',socket.id)
        delete players[socket.id]
        socket.broadcast.emit('playerDisconnected',socket.id)
    })

})



const port=process.env.PORT || 3000

server.listen(port,()=>{
    console.log(`server is listening on ${port}`)
})