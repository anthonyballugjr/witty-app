import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthProvider {
  // authURL = "http://localhost:3000/api/users";
  authURL = "http://witty-wallet.herokuapp.com/api/users"

  isLoggedIn: boolean = false;
  session: any;
  userData: any;
  authHeader = {
    headers: {
      'Authorization': 'Token ' + localStorage.token
    }
  }

  month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  n = new Date();
  m = this.month[this.n.getMonth()];
  y = this.n.getFullYear();
  period = this.m + " " + this.y;

  constructor(public http: HttpClient) {
    console.log('Hello AuthProvider Provider');
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

  login(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authURL + '/login', data)
        .subscribe(res => {
          resolve(res);
          console.log(res);
          this.userData = res;
          localStorage.setItem('token', this.userData.user.token);
          localStorage.setItem('userId', this.userData.user._id);
          localStorage.setItem('email', this.userData.user.email);
          localStorage.setItem('nickname', this.userData.user.name);
          localStorage.setItem('period', this.period);
          console.log(localStorage);
        }, (err) => {
          reject(err);
        });
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.http.get(this.authURL + '/logout').subscribe(res => {
        localStorage.clear();
        console.log(localStorage);
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  getProfile() {
    return new Promise((resolve, reject) => {
      this.http.get(this.authURL + '/profile', this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  updateNickname(nickname) {
    return new Promise((resolve, reject) => {
      this.http.put(this.authURL, nickname, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  changePassword(passwordData) {
    return new Promise((resolve, reject) => {
      this.http.put(this.authURL + '/changePassword', passwordData, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

}
