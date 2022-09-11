import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { CommonService } from './common.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    public http:HttpClient, 
    private common: CommonService,
    private datePipe: DatePipe,
  ) 
  { 
  }
  
  async get(url:any) {
    let dt = await this.common.get(url);
    return dt;
  }

  //external API
  async getExternal(url:any) {
    let dt = await this.common.getExternal(url);
    return dt;
  }
  
  async syncSicara(url:any){
    let dt =  await this.common.syncSicara(url);
    return dt;
  }
  
  async postDataSicara(url:any, data:any){
    let dt =  await this.common.postDataSicara(url, data);
    return dt;
  }

  async post(url:any, data:any) {
    let dt = await this.common.post(url, data);
    return dt;
  }

  async postCrImg(url:any, data:any) {
    let dt = await this.common.postCrImg(url, data);
    return dt;
  }

  async put(url:any, data:any) {
    let dt = await this.common.put(url, data);
    return dt;
  }

  async delete(url:any) {
    let dt = await this.common.delete(url);
    return dt;
  }

  async me()
  { 
    let dt = await this.common.get('users/me');
    return dt;
  } 

  chatSeller(ownerData:any, detailProduct:any) {
    var msg = "Halo, " + ownerData.name + ' Saya tertarik dengan produk: %0A';
    var dp = "Nama produk: " + detailProduct.name + '%0A' + "Harga: Rp." + detailProduct.price + '%0A';
    var message = msg+dp;
    var url = 'https://api.whatsapp.com/send?phone=' + ownerData.phone +'&text='+message;
    window.open(url, 'blank')
  }

  async getToday(city:any) {
    let date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let data = await this.common.getTimes('timingsByCity?city='+ city + '&country=Indonesia' + '&method=1');
    return data;
  }

  async getThisWeek(city:any) {
    let data = await this.common.getWeekTimes('this_week.json?city='+ city +'&school=1');
    return data;
  }

  async getThisMonth(month:any, year:any, city:any) {
    if(month == 0) {
      month = 12
    }
    let data = await this.common.getTimes('calendarByCity?city='+ city + '&country=Indonesia' + '&method=1' + '&month='+month+'&year='+year);
    return data;
  }

  async getWeek(start:any,end:any,city:any) {
    let data = await this.common.getWeekTimes('dates.json?city='+ city + '&start=' + start + '&end=' + end +'&school=1');
    return data;
  }

  async getMonth(month:any,city:any) {
    let data = await this.common.getTimes('month.json?city='+ city + '&month=' + month +'&school=1');
    return data;
  }

  //al Quran
  async getSurat(url:any) {
    let dt = await this.common.getSurat(url);
    return dt;
  }
}
