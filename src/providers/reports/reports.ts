import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ReportsProvider {
  // apiURL = "http://localhost:3000/api"
  apiURL = "http://witty-wallet.herokuapp.com/api"

  authHeader = {
    headers: {
      'Authorization': 'Token ' + localStorage.token
    }
  }

  constructor(public http: HttpClient) {
    console.log('Hello ReportsProvider Provider');
  }

  predict(name) {
    return new Promise(resolve => {
      this.http.get(this.apiURL + '/wallets/predict/' + localStorage.userId + '?name=' + name)
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
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

  getCurrentBudgetOverview() {
    return new Promise(resolve => {
      this.http.get(this.apiURL + '/wallets/overview/' + localStorage.userId + '?period=' + localStorage.period, this.authHeader)
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
  }

}
