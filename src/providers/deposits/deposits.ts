import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../data/apiURL';

@Injectable()
export class DepositsProvider {
  apiUrl = `${apiUrl}deposits`;
  
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
    console.log(data);
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
