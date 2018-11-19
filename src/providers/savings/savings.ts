import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class SavingsProvider {
  apiUrl = "http://localhost:3000/api/wallets/savings/";
  // apiUrl = "http://witty-wallet.herokuapp.com/api/wallets/savings/";

  authHeader = {
    headers: {
      'Authorization': `Token ${localStorage.token}`
    }
  }

  constructor(public http: HttpClient) {
    console.log('Hello SavingsProvider Provider');
  }

  getWallets() {
    return new Promise(resolve => {
      this.http.get(`${this.apiUrl}user/${localStorage.userId}`, this.authHeader)
        .subscribe(res => {
          resolve(res);
        });
    });
  }

  addWallet(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl, data, this.authHeader)
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
      this.http.put(`${this.apiUrl}${data.id}`, data, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  deleteWallet(id) {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.apiUrl}${id}`, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

}
