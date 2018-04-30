import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ChatRoomPage } from '../chat-room/chat-room';
import { UserData } from '../../providers/user-data';
import { TripsData } from '../../providers/trips-data';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  user_info: any;
  messagesList: any;

  constructor(
    public navCtrl: NavController,
    public userData: UserData,
    public tripsData: TripsData
  ) {
    this.userData.getUserInfo().then((data) => {
      if (!data) {
        this.navCtrl.setRoot('LoginPage');
      }
      this.user_info = data;
    });

    this.userData.getMessagesList().subscribe((data) => {
      this.messagesList = data;
    })

    console.log(this.messagesList);

  }

  /*joinChat() {
    this.socket.connect();
    this.socket.emit('set-user', this.user_info);
  }*/

  openChatRoom(_id) {
    this.navCtrl.push(ChatRoomPage, { me: this.user_info, members: _id });
  }
}