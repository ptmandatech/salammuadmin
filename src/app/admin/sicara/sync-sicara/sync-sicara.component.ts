import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sync-sicara',
  templateUrl: './sync-sicara.component.html',
  styleUrls: ['./sync-sicara.component.scss']
})
export class SyncSicaraComponent implements OnInit {

  constructor(
    public http:HttpClient,
    public common: CommonService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SyncSicaraComponent>,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
  }

  ngOnInit(): void {
    this.cekLogin();
    this.getAllPwm();
    this.getAllPdm();
    this.getAllPCM();
    this.getAllPRM();
  }

  userData:any;
  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
      Loading.remove();
    }, err => {
      Loading.remove();
    });
  }

  syncSicara(from:any) {
    if(from == 'wilayah') {
      Loading.pulse();
      this.api.get('sicara/syncPWMManual').then(res=>{
        Notiflix.Notify.success('Berhasil menyinkronkan data wilayah.',{ timeout: 2000 });
        Loading.remove();
        this.ngOnInit();
      }, err => {
        Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
        Loading.remove();
      });
    } else if(from == 'daerah') {
      if(this.allPwm.length == 0){
        Notiflix.Notify.failure("Data wilayah masih kosong, lakukan sinkronisasi data wilayah dahulu!",{ timeout: 2000 });
        return;
      }

      Loading.pulse();
      this.api.get('sicara/syncPDMManual').then(res=>{
        Notiflix.Notify.success('Berhasil menyinkronkan data daerah.',{ timeout: 2000 });
        Loading.remove();
        this.ngOnInit();
      }, err => {
        Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
        Loading.remove();
      });
    } else if(from == 'cabang') {
      if(this.allPdm.length == 0){
        Notiflix.Notify.failure("Data daerah masih kosong, lakukan sinkronisasi data daerah dahulu!",{ timeout: 2000 });
        return;
      }

      Loading.pulse();
      this.api.get('sicara/syncPCMManual').then(res=>{
        Notiflix.Notify.success('Berhasil menyinkronkan data cabang.',{ timeout: 2000 });
        Loading.remove();
        this.ngOnInit();
      }, err => {
        Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
        Loading.remove();
      });
      
    } else if(from == 'ranting') {
      if(this.allPcm.length == 0){
        Notiflix.Notify.failure("Data cabang masih kosong, lakukan sinkronisasi data cabang dahulu!",{ timeout: 2000 });
        return;
      }

      Loading.pulse();
      this.api.get('sicara/syncPRMManual').then(res=>{
        Notiflix.Notify.success('Berhasil menyinkronkan data ranting.',{ timeout: 2000 });
        Loading.remove();
        this.ngOnInit();
      }, err => {
        Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
        Loading.remove();
      });
      
    }
  }

  allPwm:any = [];
  getAllPwm() {
    this.allPwm = [];
    this.api.get('sicara/getAllPWM').then(res=>{
      this.allPwm = res;
      Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    });
  }

  allPdm:any = [];
  getAllPdm() {
    this.allPdm = [];
    this.api.get('sicara/getAllPDM').then(res=>{
      this.allPdm = res;
      Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    });
  }

  allPcm:any = [];
  getAllPCM() {
    this.allPcm = [];
    this.api.get('sicara/getAllPCM').then(res=>{
      this.allPcm = res;
      Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    });
  }

  allPrm:any = [];
  getAllPRM() {
    this.allPrm = [];
    this.api.get('sicara/getAllPRM').then(res=>{
      this.allPrm = res;
      Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    });
  }

}
