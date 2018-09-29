import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ReportsProvider {
  // apiURL= "http://witty-wallet.herokuapp.com/api"
  apiURL = "http://localhost:3000/api"

  authHeader = {
    headers: {
      'Authorization': 'Token ' + localStorage.token
    }
  }

  constructor(public http: HttpClient) {
    console.log('Hello ReportsProvider Provider');
  }

  getArchivesOverview() {
    return new Promise(resolve => {
      this.http.get(this.apiURL + '/archives/overview/' + localStorage.userId, this.authHeader)
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
  }

  getEntries() {
    return new Promise(resolve => {
      this.http.get(this.apiURL + '/archives?userId=' + localStorage.userId, this.authHeader)
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
  }

  getEntry(id) {
    return new Promise(resolve => {
      this.http.get(this.apiURL + '/archives/' + id, this.authHeader)
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
  }

}
