

var express = require('express')
var socket = require('socket.io');
var http = require('http');
var app = express();


var server = app.listen(3000, function(){
    console.log('server started')
})
var io = socket(server);
var sendData = {}
var tempUser1 = ''
var tempUser2 = ''
var tempObj = {}
var userList = []

privateChat = []

users = {
  user1:'',
  user2: ''
}
io.on('connection', function(socket){

userId = socket.id

socket.emit('joining',userId)

      socket.on('addNewUser',(userInfo)=>{
  
      console.log('User Connected with bame :'+userInfo.name)
      console.log('User Connected with socket id :'+userInfo.userId)
      userList.push(userInfo)

 
      socket.emit('userList',userList)
 
      socket.on('userSelected',(privateUsers)=>{

        users.user1 = privateUsers.selector
        users.user2 = privateUsers.selected
        privateChat.push(users);

          socket.on('message',(data)=>{
          console.log('incoming message is from ' + data.user)
          
          var length = privateChat.length;
          
              for(i = 0; i<length;i++){

                tempObj = privateChat[i]
                tempUser1 = tempObj.user1
                tempUser2 = tempObj.user2
                  
                if(data.user == tempUser2){
                      socket.broadcast.to(tempUser2).emit('incoming',{message:data.msg, fromUser:socket.id})
                      console.log('sending to...' + tempUser1)
                      break;}

                else if(socket.id == tempUser1){
                      socket.broadcast.to(tempUser1).emit('incoming',{message:data.msg, fromUser:socket.id})
                      console.log('sending to...' + tempUser2)
                      break}

                }

            })

      })
    })

})
