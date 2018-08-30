import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the CategoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CategoryProvider {
  wallets: any;
  categoryData: any;
  //apiUrl = "http://localhost:3000/api" //local
  apiUrl = "http://witty-wallet.herokuapp.com/api" 
  authHeader = {
    headers: {
      'Authorization': 'Token ' + localStorage.token
    }
  }

  constructor(public http: HttpClient) {
    console.log('Hello CategoryProvider Provider');
  }

  getCategories() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/categories').subscribe(data => {
        this.categoryData = data;
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

  getWallets() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/wallets/user/' + localStorage.userId, this.authHeader).subscribe(data => {
        this.categoryData = data;
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  addWallet(data) {
    console.log(localStorage.token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/wallets', data, this.authHeader).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  updateWallet(data) {
    console.log(data);
    console.log(data.id);
    return new Promise((resolve, reject) => {
      this.http.put(this.apiUrl + '/wallets/' + data.id, data, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err)
          console.log(err);
        });
    })
  }

  deleteWallet(id) {
    return new Promise((resolve, reject) => {
      this.http.delete(this.apiUrl + '/wallets/' + id, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err)
          console.log(err);
        });
    });
  }

  addTransaction(data) {
    return new Promise((resolve, reject) => {
      console.log(data);
      this.http.post(this.apiUrl + '/transactions', data, this.authHeader).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err)
      });
    })
  }



}
