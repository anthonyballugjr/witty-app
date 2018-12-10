import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';

@Injectable()
export class NetworkProvider {

  constructor(public http: HttpClient, public network: Network) {
  }

  checkNetwork(){
    if(this.network.type!=='none'){
      return true
    }
    else {
      return false;
    }
  }

}
