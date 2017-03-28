/**
 * Created by huk on 17/3/27.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

//静态服务中间件
app.use(express.static(__dirname));

app.get('/',function (req, res) {
   res.sendFile(path.join(__dirname,'index.html'));
});

var server  = http.createServer(app);

var io = require('socket.io')(server);
var clients = [];
io.on('connection',function (socket) {
    //把socket缓存起来
    clients.push(socket);
    var username;
    socket.send({user:'系统',content:'请输入用户名'});
    socket.on('message',function (msg) {
        if(username){
            //服务器接收到的消息广播给所有客户端
            clients.forEach(function (client) {
                client.send({user:username,content:msg});
            })
        }else{
            username = msg;
            socket.send({user:'系统',content:'你的用户名已修改为'+username})
        }
    })
});

server.listen(8004);
