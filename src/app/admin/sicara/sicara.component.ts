import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { SyncSicaraComponent } from './sync-sicara/sync-sicara.component';

@Component({
  selector: 'app-sicara',
  templateUrl: './sicara.component.html',
  styleUrls: ['./sicara.component.scss']
})
export class SicaraComponent implements OnInit {

  p: number = 1;
  constructor(
    public api: ApiService,
    private router: Router,
    public common: CommonService,
    public routes: ActivatedRoute,
    public dialog: MatDialog,
  ) { }

  serverImg:any;
  pageTitle:any;
  ngOnInit(): void {
    Loading.pulse();
    this.serverImg = this.common.photoBaseUrl+'sicara/';
    this.pageTitle = this.routes.snapshot.firstChild?.data.title;
    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.pageTitle = this.routes.snapshot.firstChild?.data.title;
      }
    });
    this.cekLogin();
    this.getSicaraPwm();
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

  //sync sicara modal
  syncSicara() {
    const dialogRef = this.dialog.open(SyncSicaraComponent, {
      width: '650px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.ngOnInit();
    });
  }

  syncPwm() {
    Loading.pulse();
    this.api.get('sicara/syncPWM').then(res=>{
      Notiflix.Notify.success('Berhasil menyinkronkan data SICARA.',{ timeout: 2000 });
      Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    });
  }

  allPwm:any = [];
  getSicaraPwm() {
    this.allPwm = [];
    this.api.get('sicara/getPWM').then(res=>{
      this.allPwm = res;
      Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    });
  }

}
