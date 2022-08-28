import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    public api: ApiService,
    private router: Router,
    public routes: ActivatedRoute
  ) { }

  pageTitle:any;

  ngOnInit(): void {
    Loading.pulse();
    this.pageTitle = this.routes.snapshot.firstChild?.data.title;
    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.pageTitle = this.routes.snapshot.firstChild?.data.title;
      }
    });
    this.getAllRoles();
    this.getStatistic();
  }

  allRoles:any = {};
  getAllRoles() {
    this.api.get('roles?all').then(async res=>{
      await res.forEach((e:any, index:any) => {
        e.path = JSON.parse(e.path);
      });
      await this.parseRoles(res);
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
    });
  }

  parseRoles(res:any) {
    for(var i=0; i<res.length; i++) {
      this.allRoles[res[i].id] = res[i];
    }
    this.cekLogin();
  }

  userData:any;
  cekLogin()
  {    
    this.api.me().then(async res=>{
      this.userData = res;
      await this.parseAccessMenu(this.allRoles[this.userData.role]);
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      localStorage.removeItem('salammuToken');
      this.router.navigate(['/auth/login'], {replaceUrl:true});
    })
  }

  statisticsData:any;
  getStatistic() {
    this.api.get('dashboard/statistics').then(res=>{
      this.statisticsData = res;
      Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    });
  }

  goToPage(to:any) {
    if(this.accessMenu[to]) {
      this.router.navigate([to]);
    }
  }

  accessMenu: any = {};
  parseAccessMenu(res:any) {
    for (var i = 0; i < res.path.length; i++) {
      this.accessMenu[res.path[i].path] = true;
    }
  }

}
