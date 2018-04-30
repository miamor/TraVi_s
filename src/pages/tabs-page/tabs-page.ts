import { Component } from '@angular/core';
import { NavParams, NavController, ViewController } from 'ionic-angular';

import { AccountPage } from '../account/account';
//import { AlbumListPage } from '../album-list/album-list';
import { TourListPage } from '../tour-list/tour-list';
//import { TourListWaitingPage } from '../tour-list-waiting/tour-list-waiting';
//import { UserListPage } from '../user-list/user-list';
//import { TourCreatePage } from '../tour-create/tour-create';
import { AboutPage } from '../about/about';
//import { TourFindPage } from '../tour-find/tour-find';
//import { TripCreatePage } from '../trip-create/trip-create';
//import { TripMyListPage } from '../trip-my-list/trip-my-list';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';

//import { TourBillDetailPage } from '../tour-bill-detail/tour-bill-detail';
//import { TourDetailPage } from '../tour-detail/tour-detail';

//import { ToursData } from '../../providers/tours-data';
//import { TripMyDetailPage } from '../trip-my-detail/trip-my-detail';
//import { NearbyPage } from '../nearby/nearby';
import { ChatPage } from '../chat/chat';
import { UserData } from '../../providers/user-data';
import { RequestListPage } from '../request-list/request-list';
//import { ChatPage } from '../chat/chat';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = TourListPage;
  //tab2Root: any = TripMyListPage;
  tab2Root: any = RequestListPage;
  //tab3Root: any = NearbyPage;
  tab3Root: any = ChatPage;
  //tab4Root: any = AlbumListPage;
  tab4Root: any = AccountPage;

  tab5Root: any = LoginPage;
  tab6Root: any = SignupPage;

  //tab8Root: any = ChatPage;
  tab7Root: any = AboutPage;

  msgnum = 0;

  //tab9Root: any = GuiderPage;

  mySelectedIndex: number;
  hideBottomNav: boolean;
  totalWaiting: number;

  constructor(
    public navCtrl: NavController,
    //public toursData: ToursData,
    public navParams: NavParams,
    public userData: UserData
  ) {
    //console.log(navParams);
    //console.log(this.navCtrl.getActive());
    //this.totalWaiting = this.toursData.countWaiting();

    this.hideBottomNav = true;
    /*this.navCtrl.viewDidEnter.subscribe(item => {
      //console.log(item);
      const viewController = item as ViewController;
      const n = viewController.name;
      console.log('active nav: ' + n);

    });*/

    /*if (this.navCtrl.getActive().name == 'Login') {
      this.hideBottomNav = false;
    } else {
      this.hideBottomNav = true;
    }*/
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
