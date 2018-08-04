import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  apiUrl: 'http://localhost:3000/api'

  constructor(public http: HttpClient) {
    console.log('Hello AuthProvider Provider');
  }

  login(loginData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/login', loginData).subscribe(res => {
        resolve(res);
        localStorage.setItem('jwToken', loginData.token);
      }, (err) => {
        reject(err);
      });
    });
  }

  register(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/register', data).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + '/logout').subscribe(res => {
        localStorage.clear();
      }, (err) => {
        reject(err);
      });
    });
  }

}
