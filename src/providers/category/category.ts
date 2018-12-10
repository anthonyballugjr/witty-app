import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../data/apiURL';

@Injectable()
export class CategoryProvider {
  apiUrl = apiUrl;
  
  wallets: any;
  categoryData: any;
  
  authHeader = {
    headers: {
      'Authorization': `Token ${localStorage.token}`
    }
  }

  constructor(public http: HttpClient) {
    console.log('Hello CategoryProvider Provider');
  }

  getCategories() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/categories').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  addCategory(data) {
    console.log(localStorage.token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/categories', data, this.authHeader).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  //PLAYGROUND
  getAllExpenseWallets() {
    return new Promise(resolve => {
      this.http.get(`${this.apiUrl}/wallets/expense/user/${localStorage.userId}`, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          console.log(err);
        });
    });
  }
  getAllSavingsWallet() {
    return new Promise(resolve => {
      this.http.get(`${this.apiUrl}/wallets/savings/user/${localStorage.userId}`, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          console.log(err);
        });
    });
  }
  //PLAYGROUND

  saveExpenseWallet(wallet) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiUrl}/wallets/expense`, wallet, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  saveSavingsWallet(wallet) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiUrl}/wallets/savings`, wallet, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }


}
