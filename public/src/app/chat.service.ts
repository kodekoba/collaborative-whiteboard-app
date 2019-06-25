import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
// import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { }

  sendMsg(msg: any){
    this.socket.emit('send-message', msg)
  }

  update(updateData: any){
    var user = JSON.parse(localStorage.getItem("user"));

    this.socket.on('update-messages', function (data = updateData) {
      if(data.message.room === user.room) {
        this.chats = data;

        console.log("\n---------------------------------------------\n"+user.nickname + " sent message: "+ this.msgData.message + " to ROOM: " + user.room +"\n---------------------------------------------\n");

        this.msgData = { room: user.room, nickname: user.nickname, message: '' }
        // this.getChatByRoom(user.room);
        this.scrollToBottom();
      }
    }.bind(this));
  }

}
