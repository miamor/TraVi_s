import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController } from 'ionic-angular';

/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
// import moment from 'moment';

import { ToursData } from '../../providers/tours-data';
//import { UserData } from '../../providers/user-data';
import { TourListPage } from '../tour-list/tour-list';

@Component({
  selector: 'page-tour-create',
  templateUrl: 'tour-create.html'
})
export class TourCreatePage {
  types: any = [];
  submitted = false;
  tourObject: any = [];
  tourTheme: any = [];
  tourPackages: any = [];
  tourSuitable: any = [];

  formParams: any = {
    package: [],
    packages_active: [],
    itinerary: [],
    destination_by_city: [],
    objectActive: [],
    object: [],
    suitable: [],
    suitableActive: [],
    price_unit: "$",
  };

  citys: any = [];
  citys_num = 0;
  itin: any = [];
  itin_days = 0;

  //user_token: any;

  constructor(
    public navCtrl: NavController,
    public toursData: ToursData,
    //public userData: UserData,
  ) {
    //this.userData.getToken();
    //console.log(this.user_token);

    this.tourObject = this.toursData.getTourObject();
    this.tourTheme = this.toursData.getTourTheme();
    this.tourSuitable = this.toursData.getTourSuitable();
    this.tourPackages = this.toursData.getTourPackages();
    console.log(this.tourObject);

    this.addItin();
    this.addCity();

    /*this.toursData.loadObject().subscribe((data) => {
      console.log(data);
      this.tourObject = data;
      //for (var keyObj in this.tourObject) {
      //  this.formParams.objectActive[keyObj] = 0
      //}
      for (var _i = 0; _i < this.tourObject.length; _i++) {
        this.formParams.objectActive[_i] = 0
      }
    });*/


    for (var keyObj in this.tourObject) {
      this.formParams.objectActive[keyObj] = 0
      //this.formParams.objectActive.push(0);
    }
    /*for (var _i = 0; _i < this.tourObject.length; _i++) {
      this.formParams.objectActive[_i] = 0
    }*/
    for (var _i = 0; _i < this.tourSuitable.length; _i++) {
      this.formParams.suitableActive[_i] = 0;
    }

    for (var key in this.tourPackages) {
      this.formParams.packages_active[key] = 0;

      this.formParams.package[key] = {
        des: '',
        price: []
      }
      for (var keyObjs in this.tourObject) {
        this.formParams.package[key].price[keyObjs] = ''
      }
    }
  }

  ionViewDidLoad() {
    console.log(this.tourObject);
    console.log(this.formParams.objectActive);
    console.log(this.formParams.objectActive.length);
  }

  updateObj(objKey) {
    //console.log(this.formParams.objectActive);
    //if (this.formParams.object[objKey].indexOf(this.tourObject[objKey])) {
    if (this.formParams.objectActive[objKey] == 0) {
      this.formParams.objectActive[objKey] = 1;
      //this.formParams.object[objKey] = this.tourObject[objKey];
      this.formParams.object.push(this.tourObject[objKey]);
    } else {
      this.formParams.objectActive[objKey] = 0;
      //delete this.formParams.object[objKey];
      var index = this.formParams.object.indexOf(this.tourObject[objKey]);
      if (index >= 0) {
        this.formParams.object.splice(index, 1);
      }
    }
    console.log(this.formParams.objectActive);
    console.log(this.formParams.object)
  }

  updateSuit(sKey) {
    //if (this.formParams.object[objKey].indexOf(this.tourObject[objKey])) {
    if (this.formParams.suitableActive[sKey] == 0) {
      this.formParams.suitableActive[sKey] = 1;
      this.formParams.suitable.push(this.tourSuitable[sKey]);
    } else {
      this.formParams.suitableActive[sKey] = 0;
      //delete this.formParams.object[objKey];
      var index = this.formParams.suitable.indexOf(this.tourSuitable[sKey]);
      if (index >= 0) {
        this.formParams.suitable.splice(index, 1);
      }
    }
    console.log(this.formParams.suitable)
  }

  updatePackage(pKey) {
    if (this.formParams.packages_active[pKey] == 1) {
      this.formParams.packages_active[pKey] = 0;
    } else {
      this.formParams.packages_active[pKey] = 1;
    }
  }

  addCity() {
    this.citys.push(this.citys_num);
    this.formParams.destination_by_city.push({ title: "", days: "" });
    this.citys_num++;
  }

  addItin() {
    this.itin.push(this.itin_days);
    console.log(this.itin);
    this.formParams.itinerary.push({ title: "", details: "" });
    this.itin_days++;
  }

  onCreateTour(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      console.log('form submit here~');

      var days = 0;
      for (var _i = 0; _i < this.formParams.destination_by_city.length; _i++) {
        var v = this.formParams.destination_by_city[_i];
        days += parseInt(v.days);
      }
      if (this.formParams.destination) {
        if (this.formParams.destination.indexOf('-') > -1) {
          this.formParams.destination = this.formParams.destination.split('-').map((item: string) => item.trim());
        } else if (this.formParams.destination.indexOf('-') > -1) {
          this.formParams.destination = this.formParams.destination.split(',').map((item: string) => item.trim());
        }
      }

      if (this.formParams.highlights) this.formParams.highlight = this.formParams.highlights.split("\n");
      if (this.formParams.notes) this.formParams.note = this.formParams.notes.split("\n");
      if (this.formParams.price_includes) this.formParams.price_include = this.formParams.price_includes.split("\n");
      if (this.formParams.price_excludes) this.formParams.price_exclude = this.formParams.price_excludes.split("\n");
      if (this.formParams.customer_cancels) this.formParams.customer_cancel = this.formParams.customer_cancels.split("\n");
      if (this.formParams.children_policys) this.formParams.children_policy = this.formParams.children_policys.split("\n");


      for (var key in this.formParams.package) {
        for (var keyObjs in this.tourObject) {
          if (!this.formParams.package[key].price[keyObjs] || this.formParams.package[key].price[keyObjs] == '') {
            this.formParams.package[key].price[keyObjs] = 0;
          }
        }
      }


      console.log(this.formParams);

      this.toursData.create(this.formParams).subscribe(response => {
        console.log(response);
        if (response.status == 'success') {
          this.navCtrl.push(TourListPage);
        } else {

        }
        //return response;
      }, err => {
        console.log("ERROR!: ", err);
        //return err;
        //return { status: 'error', message: err }
      });

    }
  }

}
