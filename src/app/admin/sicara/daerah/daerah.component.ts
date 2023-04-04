import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-daerah',
  templateUrl: './daerah.component.html',
  styleUrls: ['./daerah.component.scss']
})
export class DaerahComponent implements OnInit {

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
    this.getDetailPwm();
    this.getSicaraPdm();
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

  dataPwm:any = {};
  getDetailPwm() {
    this.api.get('sicara/find/sicara_pwm/'+this.id).then(res=>{
      this.dataPwm = res;
      // Loading.remove();
      this.loading = false;
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      // Loading.remove();
      this.loading = false;
    });
  }

  allPdm:any = [];
  getSicaraPdm() {
    this.allPdm = [];
    this.api.get('sicara/getPDM/'+this.id).then(res=>{
      this.allPdm = res;
      // Loading.remove();
      this.loading = false;
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      // Loading.remove();
      this.loading = false;
    });
  }

}
