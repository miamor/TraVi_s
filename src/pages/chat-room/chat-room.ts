import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavParams, ViewController, ToastController, Content } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { UserData } from '../../providers/user-data';


@Component({
    selector: 'page-chat-room',
    templateUrl: 'chat-room.html',
})
export class ChatRoomPage {
    @ViewChild('_content') content: Content;
    @ViewChild('chat_input') messageInput: ElementRef;

    messages = [];
    message = '';
    showEmojiPicker = false;
    members: any;
    user_info: any;
    //memUname = [];
    userObserver: any;

    constructor(
        //private navCtrl: NavController,
        private navParams: NavParams,
        private socket: Socket,
        private toastCtrl: ToastController,
        public viewCtrl: ViewController,
        public userData: UserData,
    ) {
        this.members = this.navParams.get('members');
        this.user_info = this.navParams.get('me');

        this.socket.connect();
        //this.socket.emit('set-nickname', this.user_info.username);
        this.socket.emit('set-user', this.user_info);
        this.socket.emit('load-old-msg', {to: this.members, lim: 20});

        console.log('Modal created~');

        /*for (var _i = 0; _i < this.members.length; _i++) {
            this.memUname.push(this.members[_i]);
        }*/
        /*this.userData.getUserInfo().then((data) => {
            this.user_info = data;
        });*/

        this.userObserver = Observable.create(observer => {
            this.userObserver = observer;
        });

        /*this.getUsers().subscribe(data => {
            //console.log(data);
            let user = data['user'];
            if (data['event'] === 'left') {
                this.showToast('User left: ' + user);
            } else {
                this.showToast('User joined: ' + user);
            }
        });*/

        this.socket.on('users-changed', (data) => {
            console.log(data);
            let user = data['user'];
            if (data['event'] === 'left') {
                this.showToast('User left: ' + user);
            } else {
                this.showToast('User joined: ' + user);
            }
        });
    }

    ionViewWillEnter() {
        this.getMessages().subscribe(message => {
            this.messages.push(message);
        });
    }

    ionViewDidEnter() {
        console.log('me: ');
        console.log(this.user_info);
        console.log(this.messages);
    }

    onFocus() {
        this.showEmojiPicker = false;
        this.content.resize();
        this.scrollToBottom();
    }

    switchEmojiPicker() {
        this.showEmojiPicker = !this.showEmojiPicker;
        if (!this.showEmojiPicker) {
            this.focus();
        } else {
            this.setTextareaScroll();
        }
        this.content.resize();
        this.scrollToBottom();
    }

    sendMessage() {
        //this.content.resize();
        this.scrollToBottom();
        this.socket.emit('add-message', {
            messageId: Date.now().toString(),
            text: this.message,
            from: this.user_info,
            to: this.members,
            time: Date.now(),
            //status: 'pending'
        });
        this.message = '';
    }

    getMessages() {
        //this.content.resize();
        this.scrollToBottom();
        var observable = new Observable(observer => {
            this.socket.on('message', (data) => {
                observer.next(data);
            });
        })
        return observable;
    }

    getUsers() {
        console.log('getUsers called');
        var observable = new Observable(observer => {
            this.socket.on('users-changed', (data) => {
                console.log(data);
                observer.next(true);
            });
        });
        return observable;
    }

    /*ionViewWillLeave() {
        this.socket.disconnect();
    }*/

    showToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }

    scrollToBottom() {
        setTimeout(() => {
            if (this.content.scrollToBottom) {
                this.content.scrollToBottom();
            }
        }, 400)
    }

    private focus() {
        if (this.messageInput && this.messageInput.nativeElement) {
            this.messageInput.nativeElement.focus();
        }
    }

    private setTextareaScroll() {
        const textarea = this.messageInput.nativeElement;
        textarea.scrollTop = textarea.scrollHeight;
    }

    dismiss(data?: any) {
        // using the injected ViewController this page
        // can "dismiss" itself and pass back data
        //console.log(data);
        this.socket.disconnect();
        this.viewCtrl.dismiss(data);
    }

}