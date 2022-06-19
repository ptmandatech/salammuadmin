import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import { DialogCabangRantingComponent } from './dialog-cabang-ranting/dialog-cabang-ranting.component';
import { DetailCabangRantingComponent } from './detail-cabang-ranting/detail-cabang-ranting.component';


@Component({
  selector: 'app-cabang-ranting',
  templateUrl: './cabang-ranting.component.html',
  styleUrls: ['./cabang-ranting.component.scss']
})
export class CabangRantingComponent implements OnInit {

  constructor(
    public api: ApiService,
    private router: Router,
    public common: CommonService,
    public routes: ActivatedRoute,
    public dialog: MatDialog,
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
    this.cekLogin();
    this.getAllCr();
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

  allCr:any = [];
  getAllCr() {
    this.api.get('cr').then(res=>{
      this.allCr = res;
      console.log(res)
      Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    });
  }

  //Dialog tambah/edit Cabang Ranting
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCabangRantingComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  //Dialog detail Cabang Ranting
  detailDialog(): void {
    const dialogRef = this.dialog.open(DetailCabangRantingComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
