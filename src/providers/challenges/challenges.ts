import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../data/apiURL'


@Injectable()
export class ChallengesProvider {
  apiURL = apiUrl;

  authHeader = {
    headers: {
      'Authorization': `Token ${localStorage.token}`
    }
  }

  constructor(public http: HttpClient) {
  }

  getChallenges() {
    return new Promise(resolve => {
      this.http.get(`${this.apiURL}challenge?userId=${localStorage.userId}`, this.authHeader)
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
  }

  update(data) {
    console.log(data);
    return new Promise((resolve, reject) => {
      this.http.put(`${this.apiURL}challenge`, data, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  addChallenge(data) {
    console.log(data);
    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiURL}challenge`, data, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  deleteChallenge(id) {
    console.log(id);
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.apiURL}challenge/${id}`, this.authHeader)
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

}
