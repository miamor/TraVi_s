import { Injectable } from '@angular/core';

import { Http, RequestOptions, Headers } from '@angular/http';
//import { HttpHeaders } from '@angular/common/http';

import { UserData } from './user-data';

//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class ToursData {
    data = {
        type: ["Interaction with local", "Nature adventure", "Foodies delight", "Traditional culture", "Relaxation"],
        object: {
            "group": "Group tour",
            "small": "Small group",
            "private": "Private tour"
        },
        //object: ["Group tour", "Small group", "Private tour"],
        suitable: ["Travel with friends", "Honeymoon couple", "Family with children", "Active traveler", "Solo traveler"],
        packages: {
            "2star": "Economy (2*)",
            "3star": "Superior (3*)",
            "4star": "First Class (4*)",
            "5star": "Luxury (5*)"
        }
    };

    user_token: string;
    user_info: any;

    constructor(
        public http: Http,
        public userData: UserData
    ) {
        this.userData.getToken().then((data) => {
            this.user_token = data;
        });
        this.userData.getUserInfo().then((data) => {
            this.user_info = data;
        })
    }


    getTourTheme() {
        return this.data.type;
    }

    getTourObject() {
        return this.data.object;
    }

    getTourSuitable() {
        return this.data.suitable;
    }

    getTourPackages() {
        return this.data.packages;
    }


    loadType() {
        return this.http.get('http://192.168.43.43:3003/tours/type/').map((res: any) => {
            let d = res.json();
            return d;
            /*var types = [];
            for (let k in d) {
                types.push(d[k])
            }
            return types*/
        })
    }

    loadObject() {
        return this.http.get('http://192.168.43.43:3003/tours/object/').map((res: any) => {
            let d = res.json();
            return d;
            /*var objects = [];
            for (let k in d) {
                objects.push(d[k])
            }
            return objects*/
        })
    }

    create(params: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', this.user_token);
        let options = new RequestOptions({ headers: headers });
        //console.log(this.user_token);

        params.user_info = this.user_info;
        return this.http.post('http://192.168.43.43:3003/sale/tours/', params, options).map(res => res.json());
    }

    edit(params: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', this.user_token);
        let options = new RequestOptions({ headers: headers });
        //console.log(this.user_token);

        params.user_info = this.user_info;
        return this.http.put('http://192.168.43.43:3003/sale/tours/', params, options).map(res => res.json());
    }

    processData(data: any) {
        // just some good 'ol JS fun with objects and arrays
        // build up the data by linking users to tours
        this.data = data.json();

        return this.data;
    }

    refresh(tour: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', this.user_token);
        let options = new RequestOptions({ headers: headers });

        //return this.load().map((data: any) => {
        return this.http.post('http://192.168.43.43:3003/sale/tours/refresh', {tour: tour}, options).map((res: any) => {
            let response = res.json();
            console.log(response);
        })
    }

    loadTours(queryText = '', segment = 'all') {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', this.user_token);
        let options = new RequestOptions({ headers: headers });

        //return this.load().map((data: any) => {
        return this.http.get('http://192.168.43.43:3003/sale/tours/', options).map((res: any) => {
            queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
            let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

            let tours_list = [];

            let toursList = res.json();
            console.log(toursList);

            toursList.forEach((tour: any) => {
                tour.objectStr = tour.object.join(', ');
                tour.destination = tour.destination.join(' - ');
                tour.suitableStr = tour.suitable.join(', ');

                if (tour.duration.indexOf('days') > -1) {
                    tour.daysNum = tour.duration.split('days')[0] + ' days';
                } else {
                    tour.daysNum = tour.duration.split('ngày')[0] + ' ngày';
                }
                // get tour min price
                var minPrice = -1;
                var dvi = tour.price_unit;
                tour.packageAr = [];
                for (let pKey in tour.package) {
                    tour.packageAr.push(tour.package[pKey]);

                    console.log(tour.package[pKey].price);

                    for (var _j = 0; _j < tour.package[pKey].price.length; _j++) {
                        //console.log(_j);
                        // check if dollar or triệu
                        //if (tour.package[pKey].price[_j].length > 0) {
                        /*dvi = tour.package[pKey].price[_j].indexOf(' triệu') > -1 ? ' triệu' : '$';
                        var pNum = parseInt(tour.package[pKey].price[_j].replace(/[^\d.]/g, ''));
                        if (minPrice == -1 || minPrice > pNum) minPrice = pNum;*/
                        var pNum = tour.package[pKey].price[_j];
                        console.log(pNum);
                        if (minPrice == -1 || minPrice > pNum) minPrice = pNum;
                        //}
                    }
                }
                tour.minPrice = (dvi == '$' ? '$' + minPrice : minPrice + ' ' + dvi);

                tour.hide = true;
                // check if this tour should show or not
                this.filterTour(tour, queryWords, segment);
                if (!tour.hide) {
                    tours_list.push(tour);
                }
            });

            return tours_list;
        });
    }

    inquire(params: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post('http://192.168.43.43:3003/tours/inquire/', params).map(res => res.json());
    }

    countWaiting(params: any) {
        return this.http.post('http://192.168.43.43:3003/tours/my_bills_count/', params).map(res => res.json());
    }

    filterTour(tour: any, queryWords: string[], segment: string) {
        console.log(queryWords);
        let matchesQueryText = false;
        /*if (queryWords.length) {
          // of any query word is in the tour title than it passes the query test
          queryWords.forEach((queryWord: string) => {
            if (tour.title.toLowerCase().indexOf(queryWord) > -1) {
              matchesQueryText = true;
            }
          });
        } else {
          // if there are no query words then this tour passes the query test
          matchesQueryText = true;
        }*/
        matchesQueryText = true;

        // if the segement is 'favorites', but tour is not a user favorite
        // then this tour does not pass the segment test
        let matchesSegment = false;
        if (segment === 'favorites') {
            if (this.userData.hasFavorite(tour.title)) {
                matchesSegment = true;
            }
        } else {
            matchesSegment = true;
        }

        // all tests must be true if it should not be hidden
        tour.hide = !(matchesQueryText && matchesSegment);
    }

}
