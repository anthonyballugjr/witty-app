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

  logout(){
    //
  }

}
