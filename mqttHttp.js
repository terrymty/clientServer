var mqtt = require('mqtt');
var mysql = require('mysql');
// var WebSocketServer = require('websocket').server;
// var http = require('http');
var client = mqtt.connect('mqtt://115.28.211.237');
var express = require('express'),
    app = express(),
    server = require('http').createServer(app);
io = require('socket.io').listen(server);
app.use(express.static('./'));
server.listen(3000);

var con = mysql.createConnection({
    host: '115.28.211.237',
    port: '3306',
    user: 'root',
    password: 'admin123',
    database: 'Database_mqtt'
});
con.connect();


var da = null;

// client.on('connect', function () {
//     client.subscribe('asd');
// });

io.on('connection', function (socket) {
    socket.on('fabu', function (data) {
        console.log('发布 主题：' + data.zt + ' 内容：' + data.nr);
        client.publish(data.zt, data.nr);
        var pub = { date: new Date(), state: '发布', topic: data.zt, payload: data.nr };
        con.query('insert into mqtt set ?', pub);
    });
    socket.on('ding', function (data) {
        console.log('订阅 主题：' + data);
        da = data;
        client.subscribe(data);
        var pub = { date: new Date(), state: '订阅', topic: data };
        con.query('insert into mqtt set ?', pub);
    });
    socket.on('quxiao', function (data) {
        console.log('取消订阅 主题：' + data);
        client.unsubscribe(data);
        var pub = { date: new Date(), state: '取消订阅', topic: data };
        con.query('insert into mqtt set ?', pub);
    });
});



client.on('message', function (topic, message) {
    console.log('发布 主题: ' + topic + ' 内容: ' + message);
    switch (da) {
        case 'qwe':
            io.sockets.emit('dingyue', message.toString());
            break;
        case 'asd':
            io.sockets.emit('dingyue', message.toString());
            break;
        default:
            break;
    }
});






//var client  = mqtt.connect('mqtt://m2m.vicbang.com',{
//    username:'13800000000',
//    password:'123456',
//    clientId:'app_13800000000'
//});




