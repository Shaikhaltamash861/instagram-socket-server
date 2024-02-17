const express=require('express')
const app=express()
const cors =require('cors')
const PORT=process.env.PORT||5500;
app.use(cors())
app.get('/',(req,res)=>res.send('Socket is live'))
const server=require('http').createServer(app)
const io=require('socket.io')(server,{
    cors:{
        origin:'*'
    }
})
let users=[]
const addUsers=(userId,socketId)=>{
    
    !users.some((user)=>user.userId===userId)&&
    users.push({userId,socketId})
}
const removeUser=(socketId)=>{
    users=users.filter((user)=>user.socketId!==socketId)
    
}
const getUsers=(userId)=>{
    return users.find((user)=>user.userId==userId)
}
io.on('connection',(socket)=>{
    
    socket.on('addUsers',(userId)=>{
        
        addUsers(userId,socket.id)
        io.emit('online-users',users)
        console.log(users.length)
    })
    socket.on('sendMessage',({senderId,receiverId,message})=>{
        
        const user=getUsers(receiverId);
        if( user?.socketId){
            console.log(`msg`)
            
            io.to(user.socketId).emit('getMessage',{senderId,message})
        }
        
    })
    socket.on('disconnect',()=>{
        console.log('user is disconnected')
        
        removeUser(socket.id)
        console.log(users.length)
        io.emit('online-users',users)
    })
})
server.listen(PORT,()=>console.log(`Socket server is live on ${PORT}`))

// const PORT=process.env.PORT||8900;
// const io=require('socket.io')(PORT,{
//     cors:{
//         origin:'*'
//     }
// })

// let users=[]
// const addUsers=(userId,socketId)=>{
    
//     !users.some((user)=>user.userId===userId)&&
//     users.push({userId,socketId})
// }
// const removeUser=(socketId)=>{
    //     users=users.filter((user)=>user.socketId!==socketId)
    
    // }
// const getUsers=(userId)=>{
//     return users.find((user)=>user.userId==userId)
// }
// io.on("connection", (socket) => {
    //   // ...
    
    //   socket.on('addUsers',(userId)=>{
        
//     addUsers(userId,socket.id)
//     console.log(users.length)
//     io.emit('online-users',users)
//   })
  
//   socket.on('sendMessage',({senderId,receiverId,message})=>{
//              const user=getUsers(receiverId)
             
//              if(user?.socketId){console.log('msg sended')

//                 io.to(user?.socketId).emit('getMessage',{senderId,message})
//              }else{
//                 console.log(user)
//              }

//   })


//   socket.on('disconnect',()=>{
//     console.log('user is disconnected')
    
//     removeUser(socket.id)
//     io.emit('online-users',users)
// })
// });

