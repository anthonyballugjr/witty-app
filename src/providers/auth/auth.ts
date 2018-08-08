import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  authURL = "http://localhost:3000/auth";

  constructor(public http: HttpClient) {
    console.log('Hello AuthProvider Provider');
  }

  login(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authURL + '/login', data)
        .subscribe(res => {
          resolve(res);
          localStorage.setItem('token', data.token);
        }, (err) => {
          reject(err);
        });
    });
  }

  register(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authURL + '/register', data).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.http.get(this.authURL + '/logout').subscribe(res => {
        localStorage.clear();
      }, (err) => {
        reject(err);
      });
    });
  }

}
