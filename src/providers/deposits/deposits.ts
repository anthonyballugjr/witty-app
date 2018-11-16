import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DepositsProvider {
  // apiUrl = "http://localhost:3000/api/deposits"
  apiUrl = "http://witty-wallet.herokuapp.com/api/deposits"
  authHeader = {
    headers: {
      'Authorization': `Token ${localStorage.token}`
    }
  }

  constructor(public http: HttpClient) {
    console.log('Hello DepositsProvider Provider');
  }

  getDeposits(id) {
    return new Promise(resolve => {
      this.http.get(`${this.apiUrl}?walletId=${id}`, this.authHeader)
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
  }

  addDeposit(data) {
    return new Promise((resolve, reject) => {
      console.log(data);
      this.http.post(this.apiUrl, data, this.authHeader).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err)
      });
    })
  }

}
