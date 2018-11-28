import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ReportsProvider {
  // apiURL = "http://localhost:3000/api"
  apiURL = "http://witty-wallet.herokuapp.com/api"

  authHeader = {
    headers: {
      'Authorization': `Token ${localStorage.token}`
    }
  }

  constructor(public http: HttpClient) {
    console.log('Hello ReportsProvider Provider');
  }

  budgetProfile() {
    return new Promise(resolve => {
      this.http.get(`${this.apiURL}/reports/budgetProfile/${localStorage.userId}`, this.authHeader)
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
  }

  getArchivesOverview() {
    return new Promise(resolve => {
      this.http.get(`${this.apiURL}/archives/overview/${localStorage.userId}`, this.authHeader)
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
  }

  saveArchive(data) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiURL}/archives`, data, this.authHeader)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  getBudgetOverview(period) {
    return new Promise(resolve => {
      this.http.get(`${this.apiURL}/reports/overview/${localStorage.userId}?period=${period}`, this.authHeader)
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
  }

  savingsOverview() {
    return new Promise(resolve => {
      this.http.get(`${this.apiURL}/wallets/savings/overview/${localStorage.userId}`, this.authHeader)
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err)
        });
    });
  }

}
