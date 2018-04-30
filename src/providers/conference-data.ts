import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { UserData } from './user-data';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class ConferenceData {
  data: any;

  constructor(public http: Http, public user: UserData) { }

  load(): any {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      // Get data here ~~~~~~~~~~~~~~~~~~~~~
      return this.http.get('assets/data/data.json')
        .map(this.processData, this);
    }
  }

  loadTour(id: string) {
    // Get data here ~~~~~~~~~~~~~~~~~~~~~
    return this.http.get('http://192.168.43.43:3003/tours/view/'+id).map((res:any) => {
      let data = res.json();
      console.log(data);

      return data
    })
  }

  processData(data: any) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking users to tours
    this.data = data.json();

    /*this.data.toursList.forEach((tour: any) => {
      if (tour.type) {
        tour.type.forEach((type: any) => {
          if (this.data.tourType.indexOf(type) < 0) {
            this.data.tourType.push(type);
          }
        });
      }
    });*/

    // loop through each day in the toursList
    /*this.data.toursList_Schedule.forEach((day: any) => {
      // loop through each timeline group in the day
      day.groups.forEach((group: any) => {
        // loop through each tour in the timeline group
        group.tours.forEach((tour: any) => {
          tour.users = [];
          if (tour.userNames) {
            tour.userNames.forEach((userName: any) => {
              let user = this.data.users.find((s: any) => s.name === userName);
              if (user) {
                tour.users.push(user);
                user.tours = user.tours || [];
                user.tours.push(tour);
              }
            });
          }

          if (tour.tracks) {
            tour.tracks.forEach((track: any) => {
              if (this.data.tracks.indexOf(track) < 0) {
                this.data.tracks.push(track);
              }
            });
          }
        });
      });
    });*/

    return this.data;
  }

  getTimeline(dayIndex: number, queryText = '', excludeTracks: any[] = [], segment = 'all') {
    return this.load().map((data: any) => {
      let day = data.toursList_Schedule[dayIndex];
      day.shownTours = 0;

      queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

      console.log(queryWords);
      console.log(excludeTracks);
      console.log(segment);
      /*day.groups.forEach((group: any) => {
        group.hide = true;

        group.tours.forEach((tour: any) => {
          // check if this tour should show or not
          this.filterTourSchedule(tour, queryWords, excludeTracks, segment);

          if (!tour.hide) {
            // if this tour is not hidden then this group should show
            group.hide = false;
            day.shownTours++;
          }
        });

      });*/

      return day;
    });
  }

  getAlbums() {
    return this.load().map((data: any) => {
      return data.albumsList.sort((a: any, b: any) => {
        let aName = a.title.split(' ').pop();
        let bName = b.title.split(' ').pop();
        return aName.localeCompare(bName);
      });
    });
  }

  loadTrips() {
    return this.http.get('http://192.168.43.43:3003/trips/').map((res:any) => {
      let data = res.json();
      console.log(data);

      return data
    })
  }

  loadTours(queryText = '', segment = 'all') {
    //return this.load().map((data: any) => {
    return this.http.get('http://192.168.43.43:3003/tours/').map((res: any) => {
      queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

      let tours_list = [];

      let toursList = res.json();
      console.log(toursList);

      toursList.forEach((tour: any) => {
        // get tour min price
        var minPrice = -1;
        var dvi = '';
        tour.packageAr = [];
        for (let pKey in tour.package) {
          tour.packageAr.push(tour.package[pKey]);

          for (var _j = 0; _j < tour.package[pKey].price.length; _j++) {
            // check if dollar or triệu
            if (tour.package[pKey].price[_j].length > 0) {
              dvi = tour.package[pKey].price[_j].indexOf(' triệu') > -1 ? ' triệu' : '$';
              var pNum = parseInt(tour.package[pKey].price[_j].replace(/[^\d.]/g, ''));
              if (minPrice == -1 || minPrice > pNum) minPrice = pNum;
            }
          }
        }

        tour.minPrice = dvi == '$' ? '$'+minPrice : minPrice+' '+dvi;

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
      if (this.user.hasFavorite(tour.title)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    // all tests must be true if it should not be hidden
    tour.hide = !(matchesQueryText && matchesSegment);
  }

  filterTourSchedule(tour: any, queryWords: string[], excludeTracks: any[], segment: string) {

    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the tour name than it passes the query test
      queryWords.forEach((queryWord: string) => {
        if (tour.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this tour passes the query test
      matchesQueryText = true;
    }

    // if any of the tours tracks are not in the
    // exclude tracks then this tour passes the track test
    let matchesTracks = false;
    tour.tracks.forEach((trackName: string) => {
      if (excludeTracks.indexOf(trackName) === -1) {
        matchesTracks = true;
      }
    });

    // if the segement is 'favorites', but tour is not a user favorite
    // then this tour does not pass the segment test
    let matchesSegment = false;
    if (segment === 'favorites') {
      if (this.user.hasFavorite(tour.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    // all tests must be true if it should not be hidden
    tour.hide = !(matchesQueryText && matchesTracks && matchesSegment);
  }

  getUsers() {
    return this.load().map((data: any) => {
      return data.users.sort((a: any, b: any) => {
        let aName = a.name.split(' ').pop();
        let bName = b.name.split(' ').pop();
        return aName.localeCompare(bName);
      });
    });
  }

  getTourType() {
    return this.load().map((data: any) => {
      return data.tourType.sort();
    });
  }

  getTourObject() {
    return this.load().map((data: any) => {
      return data.tourObject;
      //return data.tourObject.sort();
    });
  }

  getMap() {
    return this.load().map((data: any) => {
      return data.map;
    });
  }

}
