import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:3001', options: {} };


import { PipeModule } from '../pipes/pipes'

import { UserData } from '../providers/user-data';
import { TripsData } from '../providers/trips-data';
import { ToursData } from '../providers/tours-data';
import { EmojiPickerComponentModule } from "../components/emoji-picker/emoji-picker.module";
import { EmojiProvider } from "../providers/emoji";


import { MyApp } from './app.component';
//import { HomePage } from '../pages/home/home';
import { RequestListPage } from '../pages/request-list/request-list';
import { RequestDetailPage } from '../pages/request-detail/request-detail';
import { TourCreatePage } from '../pages/tour-create/tour-create';
import { TourListPage } from '../pages/tour-list/tour-list';
import { TourDetailPage } from '../pages/tour-detail/tour-detail';
import { TourEditPage } from '../pages/tour-edit/tour-edit';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { ChatPage } from '../pages/chat/chat';
import { ChatRoomPage } from '../pages/chat-room/chat-room';
import { TabsPage } from '../pages/tabs-page/tabs-page';


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    RequestDetailPage,
    RequestListPage,
    TourCreatePage,
    TourListPage,
    TourDetailPage,
    TourEditPage,
    AccountPage,
    LoginPage,
    SignupPage,
    ChatPage,
    ChatRoomPage,
    AboutPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    PipeModule.forRoot(),
    SocketIoModule.forRoot(config),
    EmojiPickerComponentModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    RequestDetailPage,
    RequestListPage,
    TourCreatePage,
    TourListPage,
    TourDetailPage,
    TourEditPage,
    AccountPage,
    LoginPage,
    SignupPage,
    ChatPage,
    ChatRoomPage,
    AboutPage
  ],
  providers: [
    UserData,
    TripsData,
    ToursData,
    EmojiProvider,
    //Storage,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
