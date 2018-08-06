import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';



/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  // loginauthURL: 'http://127.0.0.1:3000/auth';
  // registerauthURL: 'http://127.0.0.1:3000/auth';
  // logoutauthURL: 'http://127.0.0.1:3000/auth';
  authURL = "http://localhost:3000/auth";


  constructor(public http: HttpClient) {
    console.log('Hello AuthProvider Provider');
  }

  login(loginData) {
    // console.log(this.authURL + 'login');
    return new Promise((resolve, reject) => {
      this.http.post(this.authURL + '/login', loginData).subscribe(res => {
        resolve(res);
        localStorage.setItem('jwToken', loginData.token);
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
