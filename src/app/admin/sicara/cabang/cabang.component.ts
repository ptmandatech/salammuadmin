import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { DialogCabangComponent } from './dialog-cabang/dialog-cabang.component';

@Component({
  selector: 'app-cabang',
  templateUrl: './cabang.component.html',
  styleUrls: ['./cabang.component.scss']
})
export class CabangComponent implements OnInit {

  id:any;
  p: number = 1;
  serverImg:any;
  pageTitle:any;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public routes:ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    Loading.pulse();
    this.id = this.routes.snapshot.paramMap.get('id');
    this.serverImg = this.common.photoBaseUrl+'sicara/';
    this.pageTitle = this.routes.snapshot.firstChild?.data.title;
    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.pageTitle = this.routes.snapshot.firstChild?.data.title;
      }
    });
    this.cekLogin();
    this.getDetailPdm();
    this.getSicaraPcm();
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

  dataPdm:any = {};
  getDetailPdm() {
    this.api.get('sicara/find/sicara_pdm/'+this.id).then(res=>{
      this.dataPdm = res;
      Loading.remove();
    }, err => {
      console.log(err)
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    });
  }

  allPcm:any = [];
  getSicaraPcm() {
    this.allPcm = [];
    this.api.get('sicara/getPCM/'+this.id).then(res=>{
      this.allPcm = res;
      if(this.allPcm.length == 0) {
        Loading.pulse();
        this.syncCabang();
      }
      Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    });
  }

  syncCabang() {
    this.api.get('sicara/syncPCMManualByID/'+this.id).then(res => {
      this.getAfterManualSync();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    })
  }

  async getAfterManualSync() {
    this.allPcm = [];
    await this.api.get('sicara/getPCM/'+this.id).then(res=>{
      this.allPcm = res;
      Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    });
  }

  //Dialog detail Cabang
  openDialog(data:any): void {
    const dialogRef = this.dialog.open(DialogCabangComponent, {
      width: '650px',
      data: {data:data}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
