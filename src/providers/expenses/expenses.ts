import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../data/apiURL';

@Injectable()
export class ExpensesProvider {
  apiURL = `${apiUrl}wallets/expense/`;
  // apiURL = "http://localhost:3000/api/wallets/expense/";
  // apiURL = "http://witty-wallet.herokuapp.com/api/wallets/expense/"

  authHeader = {
    headers: {
      'Authorization': `Token ${localStorage.token}`
    }
  }

  constructor(public http: HttpClient) {
    console.log('Hello ExpensesProvider Provider');
  }

  getWallets(period) {
    return new Promise(resolve => {
      this.http.get(`${this.apiURL}user/${localStorage.userId}?period=${period}`, this.authHeader)
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
  }

  addWallet(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiURL, data, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  updateWallet(data) {
    console.log(data);
    console.log(data.id);
    return new Promise((resolve, reject) => {
      this.http.put(`${this.apiURL}${data.id}`, data, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  deleteWallet(id) {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.apiURL}${id}`, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        })
    })
  }

  predict(name) {
    return new Promise(resolve => {
      this.http.get(`${this.apiURL}predict/${localStorage.userId}?name=${name}`, this.authHeader)
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
  }

  suggest(name) {
    return new Promise(resolve => {
      this.http.get(`${this.apiURL}suggest/${localStorage.userId}?name=${name}`, this.authHeader)
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
  }

  auto(name) {
    return new Promise(resolve => {
      this.http.get(`${this.apiURL}auto/${localStorage.userId}?name=${name}`, this.authHeader)
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
  }

}
