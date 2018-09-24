import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginPage } from '../../pages/login/login';

@Injectable()
export class AuthProvider {
  isLoggedIn: boolean = false;
  session: any;
  userData: any;
  authHeader = {
    headers: {
      'Authorization': 'Token ' + localStorage.token
    }
  }

  authURL = "http://localhost:3000/api/users";
  // authURL = "http://witty-wallet.herokuapp.com/api/users" 

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

  // logout() {
  //   localStorage.clear();
  //   console.log(localStorage);
  //   this.navCtrl.setRoot(LoginPage);
  // }

  getProfile() {
    return new Promise((resolve, reject) => {
      this.http.get(this.authURL + '/profile/' + localStorage.email, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  updateNickname(nickname) {
    return new Promise((resolve, reject) => {
      this.http.put(this.authURL + '/' + localStorage.userId, nickname, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  changePassword(passwordData) {
    return new Promise((resolve, reject) => {
      this.http.put(this.authURL + '/changePassword/' + localStorage.userId, passwordData, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

}
