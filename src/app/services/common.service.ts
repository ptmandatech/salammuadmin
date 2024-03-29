import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  httpOption:any;
  serverPrayTimes='https://api.pray.zone/v2/times/';
  serverPrayTimes2='https://api.aladhan.com/v1/';
  serverUrl='https://api.salammu.id/index.php/';
  serverImgPath='https://api.salammu.id/';
  public photoBaseUrl='https://api.salammu.id/photos/';

  //server Al Quran
  serverAlQuran = 'https://equran.id/api/';
  constructor(
    public http:HttpClient
  ) 
  {
    
  }

  token:any;
  getToken()
  {
    var tokens=localStorage.getItem('salammuToken');
    this.token={email:'',jwt:''};
    if(tokens!=null)
    {
      this.token=JSON.parse(tokens);      
    }
    this.httpOption = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer '+this.token.jwt
      })
    };
  }
  
  httpOption2:any;
  getToken2()
  {
    var tokens=localStorage.getItem('salammuToken');
    this.token={email:'',jwt:''};
    if(tokens!=null)
    {
      this.token=JSON.parse(tokens);      
    }
    this.httpOption2 = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+this.token.jwt
      })
    };
  }

  generateOption(bearer:any)
  {
    this.httpOption = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer '+bearer
      })
    };
  }

  generateOptionExternal()
  {
    this.httpOption = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
  }
 
  times:any;
  async getTimes(url:any)
  {
    this.times = undefined;
    this.times = await this.http.get(this.serverPrayTimes2+url).toPromise();
    return this.times.data;
  }

  weekTimes:any;
  async getWeekTimes(url:any)
  {
    this.weekTimes = undefined;
    this.weekTimes = await this.http.get(this.serverPrayTimes+url).toPromise();
    return this.weekTimes.results;
  }

  data:any;
  async get(url:any)
  {
    this.getToken();
    this.data = undefined;
    this.data = await this.http.get(this.serverUrl+url, this.httpOption).toPromise();
    return this.data;
  }

  serverExternal = 'https://sicara.id/api/v0/';
  async getExternal(url:any)
  {
    this.data = undefined;
    this.data = await this.http.get(this.serverExternal+url, this.httpOption).toPromise();
    return this.data;
  }

  async syncSicara(url:any){
    this.data = undefined;
    this.data = await this.http.get(url).toPromise();
    return this.data;
  }
  
  postDataSicara(url:any, data:any)
  {
    this.getToken();
    return this.http.post(this.serverUrl+url,data, this.httpOption).toPromise();
  }
  
  post(url:any,data:any)
  {
    this.getToken();
    return this.http.post(this.serverUrl+url,data, this.httpOption).toPromise();
  }

  postCrImg(url:any,data:any)
  {
    this.getToken2();
    return this.http.post(this.serverUrl+url,data, this.httpOption2).toPromise();
  }
  
  put(url:any,data:any)
  {
    this.getToken();
    return this.http.put(this.serverUrl+url,data, this.httpOption).toPromise();
  }
  
  delete(url:any)
  {
    this.getToken();
    return this.http.delete(this.serverUrl+url, this.httpOption).toPromise();
  }

  //Al Quran
  async getSurat(url:any) {
    this.data = undefined;
    this.data = await this.http.get(this.serverAlQuran+url).toPromise();
    return this.data;
  }
}
