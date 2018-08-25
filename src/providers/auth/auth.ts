import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class AuthProvider {
  isLoggedIn: boolean = false;
  session: any;
  userData: any;
  appendHeaders = {
    headers: {
     'Content-type': 'application/json' 
    }
  }

// authURL = "http://localhost:3000/api/users";
authURL = "http://witty-wallet.herokuapp.com/api/users" 

  constructor(public http: HttpClient) {
    console.log('Hello AuthProvider Provider');
  }


  login(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authURL + '/login', data, this.appendHeaders)
        .subscribe(res => {
          resolve(res);
          console.log(res);
          this.userData = res;
          localStorage.setItem('token',  this.userData.user.token);
          localStorage.setItem('userId', this.userData.user._id);
          localStorage.setItem('email', this.userData.user.email);
          localStorage.setItem('nickname', this.userData.user.name);
          console.log(localStorage);
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
    console.log('Removing auth token: ' + localStorage.token);
    return new Promise((resolve, reject) => {
      this.http.get(this.authURL + '/logout').subscribe(res => {
        localStorage.clear();
        resolve(res);
        console.log(localStorage)
      }, (err) => {
        reject(err);
      });
    });
  }

}
