import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { DialogRantingComponent } from './dialog-ranting/dialog-ranting.component';


@Component({
  selector: 'app-ranting',
  templateUrl: './ranting.component.html',
  styleUrls: ['./ranting.component.scss']
})
export class RantingComponent implements OnInit {

  id:any;
  p: number = 1;
  serverImg:any;
  pageTitle:any;
  loading:boolean = false;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public routes:ActivatedRoute,
    public dialog:MatDialog
  ) { }

  ngOnInit(): void {
    // Loading.pulse();
    this.loading = true;
    this.id = this.routes.snapshot.paramMap.get('id');
    this.serverImg = this.common.photoBaseUrl+'sicara/';
    this.pageTitle = this.routes.snapshot.firstChild?.data.title;
    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.pageTitle = this.routes.snapshot.firstChild?.data.title;
      }
    });
    this.cekLogin();
    this.getDetailPcm();
    this.getSicaraPrm();
  }

  searchText = '';
  onSearch() {
    this.p = 1;
  }

  userData:any;
  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      localStorage.removeItem('salammuToken');
      this.router.navigate(['/auth/login'], {replaceUrl:true});
    })
  }

  dataPcm:any = {};
  getDetailPcm() {
    this.api.get('sicara/find/sicara_pcm/'+this.id).then(res=>{
      this.dataPcm = res;
      // Loading.remove();
      this.loading = false;
    }, err => {
      if(err.error) {
        Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      }
      // Loading.remove();
      this.loading = false;
    });
  }

  allPrm:any = [];
  getSicaraPrm() {
    this.allPrm = [];
    this.api.get('sicara/getPRM/'+this.id).then(res=>{
      this.allPrm = res;
      if(this.allPrm.length == 0) {
        // Loading.pulse();
        this.loading = true;
        this.syncRanting();
      }
      // Loading.remove();
      this.loading = false;
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      // Loading.remove();
      this.loading = false;
    });
  }

  syncRanting() {
    this.api.get('sicara/syncPRMManualByID/'+this.id).then(res => {
      this.getAfterManualSync();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      // Loading.remove();
      this.loading = false;
    })
  }

  async getAfterManualSync() {
    this.allPrm = [];
    await this.api.get('sicara/getPRM/'+this.id).then(res=>{
      this.allPrm = res;
      // Loading.remove();
      this.loading = false;
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      // Loading.remove();
      this.loading = false;
    });
  }

  //Dialog detail Cabang
  openDialog(data:any): void {
    const dialogRef = this.dialog.open(DialogRantingComponent, {
      width: '650px',
      data: {data:data}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
