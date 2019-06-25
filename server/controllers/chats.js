const server = require('../../server.js')
const io = require('socket.io')(server);
const Chat = require('../models/Chat.js')

// socket io
io.on('connection', function (socket) {
    console.log('User connected');
    socket.on('disconnect', function() {
      console.log('User disconnected');
    });
    // socket.on('save-message', function (data) {
    //   console.log(data);
    //   io.emit('new-message', { message: data });
    // });
    socket.on('send-message', function (msg) {
        console.log("SENT MESSAGE:\n"+JSON.stringify(msg));
        Chat.create(msg, function(err, data){
            console.log(data);
            if(err){
                console.log("err creating message:\n"+err);
                // res.json({errorMsg: "Error", error: err});
            } else {
                // res.json({message: "Success", data: data});
                console.log("YEEEEEEEEEEE BOOOIIIIIII")
            }
        });
        Chat.find({room: msg.room}, function(err, data){
            if(err){
                console.log("err retrieving all messages:\n" + err)
                // res.json({errorMsg: "Error", error: err});
            } else {
                // res.json({data});
                console.log("DATAAAAAA:\n"+JSON.stringify(data));

                io.emit('update-messages', data)
            }
        });
    })
});

module.exports = {
    allChats: function(req, res){
        Chat.find({room: req.params.room}, function(err, data){
            if(err){
                console.log("err retrieving all Chats")
                res.json({errorMsg: "Error", error: err});
            } else {
                res.json({data});
            }
        });
    },
    newMsg: function(req, res){
        Chat.create(req.body, function(err, data){
            console.log(req.body);
            if(err){
                console.log("err creating Chat");
                res.json({errorMsg: "Error", error: err});
            } else {
                res.json({message: "Success", data: data});
            }
        });
    }

}