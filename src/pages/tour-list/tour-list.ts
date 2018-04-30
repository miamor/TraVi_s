import { Component, ViewChild } from '@angular/core';

import { AlertController, App, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';

/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
// import moment from 'moment';

import { ToursData } from '../../providers/tours-data';
import { UserData } from '../../providers/user-data';

import { TourDetailPage } from '../tour-detail/tour-detail';
import { TourCreatePage } from '../tour-create/tour-create';


@Component({
  selector: 'page-tour',
  templateUrl: 'tour-list.html'
})
export class TourListPage {
  // the list is a child of the Tour page
  // @ViewChild('tourList') gets a reference to the list
  // with the variable #tourList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('tourList', { read: List }) tourList: List;

  dayIndex = 0;
  queryText = '';
  segment = 'all';
  shownTours = 0;
  excludeTypeIds: any = [];
  tours: any = [];
  confDate: string;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public userData: UserData,
    public toursData: ToursData,
  ) {
    this.app.setTitle('Tours');

    this.userData.getToken().then((data) => {
      this.updateTour();
    })
  }

  ionViewWillLoad() {
  }


  updateTour() {
    // Close any open sliding items when the tour updates
    this.tourList && this.tourList.closeSlidingItems();

    this.toursData.loadTours(this.queryText, this.segment).subscribe((tours: any) => {
      this.tours = tours;
      console.log(tours);
      this.shownTours = tours.length;
      //console.log(this.shownTours);
    });
  }

  goToTourDetail(tourData: any) {
    // go to the tour detail page
    // and pass in the tour data

    this.navCtrl.push(TourDetailPage, { tourId: tourData.id, tourInfo: tourData, name: tourData.title });
  }

  goToTourCreate() {
    this.navCtrl.push(TourCreatePage);
  }

  addFavorite(slidingItem: ItemSliding, tourData: any) {

    if (this.userData.hasFavorite(tourData.title)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, tourData, 'Favorite already added');
    } else {
      // remember this tour as a user favorite
      this.userData.addFavorite(tourData.title);

      // create an alert instance
      let alert = this.alertCtrl.create({
        title: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });
      // now present the alert on top of all other content
      alert.present();
    }

  }

  removeFavorite(slidingItem: ItemSliding, tourData: any, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this tour from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the tour
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this tour from their favorites
            this.userData.removeFavorite(tourData.title);
            this.updateTour();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  /*openSocial(network: string, fab: FabContainer) {
    let loading = this.loadingCtrl.create({
      content: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    loading.onWillDismiss(() => {
      fab.close();
    });
    loading.present();
  }*/

  doRefresh(refresher: Refresher) {
    this.toursData.loadTours().subscribe((tours: any) => {
      this.tours = tours;
      this.shownTours = tours.length

      // simulate a network request that would take longer
      // than just pulling from out local json file
      setTimeout(() => {
        refresher.complete();

        const toast = this.toastCtrl.create({
          message: 'Tours have been updated.',
          duration: 3000
        });
        toast.present();
      }, 1000);
    });
  }

  refreshItem(tour: any) {
    //console.log('send refresh request '+tour);
    this.toursData.refresh(tour);
  }
}
