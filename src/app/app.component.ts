//import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { RequestListPage } from '../pages/request-list/request-list';
//import { RequestDetailPage } from '../pages/request-detail/request-detail';
import { TourListPage } from '../pages/tour-list/tour-list';
import { TourCreatePage } from '../pages/tour-create/tour-create';
import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { ChatPage } from '../pages/chat/chat';


import { UserData } from '../providers/user-data';
import { ToursData } from '../providers/tours-data';
import { TabsPage } from '../pages/tabs-page/tabs-page';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.template.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  appPages: PageInterface[] = [
    { title: 'Tours', name: 'TourListPage', component: TourListPage, icon: 'person' },
    { title: 'Tour requests', name: 'RequestListPage', component: RequestListPage, icon: 'person' },
    { title: 'Add tour', name: 'TourCreatePage', component: TourCreatePage, icon: 'person' },
    { title: 'About', name: 'AboutPage', component: AboutPage, icon: 'person' },
  ];
  loggedInPages: PageInterface[] = [
    { title: 'Chat', name: 'ChatPage', component: ChatPage, icon: 'person' },
    { title: 'Account', name: 'AccountPage', component: AccountPage, icon: 'person' },
    { title: 'Logout', name: 'TabsPage', component: RequestListPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    //{ title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'log-in' },
    //{ title: 'Signup', name: 'SignupPage', component: SignupPage, icon: 'person-add' }
    { title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'log-in' },
    { title: 'Signup', name: 'SignupPage', component: SignupPage, icon: 'person-add' }
  ];

  rootPage: any = TabsPage;


  constructor(
    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    //public confData: ConferenceData,

    public toursData: ToursData,

    public storage: Storage,
    public splashScreen: SplashScreen,
  ) {
    this.initializeApp();
    // load the conference data
    //confData.load();

    // decide which menu items should be hidden by current login status stored in local storage
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      if (!hasLoggedIn) {
        this.rootPage = LoginPage;
      }
      this.enableMenu(hasLoggedIn === true);
    });
    this.enableMenu(true);

    this.listenToLoginEvents();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.userData.logout();
    }

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);

  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }


  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }

}
