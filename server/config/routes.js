const chats = require("../controllers/chats.js");

module.exports =function(app){
    app.get("/whatever",function(req,res){
        console.log(req,res);
    })

    // all messages in chatroom
    app.get("/:room", function(req, res){
        chats.allChats(req, res);
    })

    // save new chat message
    app.post("/", function(req, res){
        chats.newMsg(req, res);
    })
}