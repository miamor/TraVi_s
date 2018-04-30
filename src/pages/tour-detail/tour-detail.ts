import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';

import { ToursData } from '../../providers/tours-data';
import { TourEditPage } from '../tour-edit/tour-edit';


@Component({
    selector: 'page-tour-detail',
    templateUrl: 'tour-detail.html'
})
export class TourDetailPage {
    tour: any;
    showVbox: { overview: boolean, itinerary: boolean, price: boolean };

    constructor(
        public toursData: ToursData,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public navCtrl: NavController
    ) {
        this.showVbox = { overview: true, itinerary: false, price: false };
        console.log(this.showVbox);
        this.tour = this.navParams.data.tourInfo;
        console.log(this.tour);
    }

    ionViewWillEnter() {
        /*this.toursData.loadTour(this.navParams.data.tourId).subscribe((data: any) => {
            this.tour = data;
            console.log(this.tour);
        });*/
    }

    toggleVbox(boxID) {
        this.showVbox[boxID] = !this.showVbox[boxID];
    }

    editTour() {
        /*console.log('editTour called');
        let modal = this.modalCtrl.create(TourEditPage, { tourInfo: this.tour });
        modal.present();

        modal.onWillDismiss((data: any[]) => {
            if (data) {
                console.log(data);
            }
        });

        modal.onDidDismiss((data: any) => {
            console.log(data);
            this.navCtrl.push(TourDetailPage, { tourId: data.id, tourInfo: data, name: data.title });
        });*/

        this.navCtrl.push(TourEditPage, { tourId: this.tour.id, tourInfo: this.tour, name: this.tour.title });
    }

    viewCompany() {
        console.log('viewCompany~')
    }
}
