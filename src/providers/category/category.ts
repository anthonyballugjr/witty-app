import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the CategoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CategoryProvider {
  categoryData:any;
  //apiUrl = "http://localhost:3000/api" //local
  apiUrl = "http://witty-wallet.herokuapp.com/api" //web
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

}
