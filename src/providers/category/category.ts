import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the CategoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CategoryProvider {
  apiUrl = "http://localhost:3000"

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
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/categories', data).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

}
