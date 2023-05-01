import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import * as Notiflix from 'notiflix';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotifmanualComponent } from './notifmanual/notifmanual.component';
import { DialogNotifikasiComponent } from './dialog-notifikasi/dialog-notifikasi.component';

@Component({
  selector: 'app-notifikasi',
  templateUrl: './notifikasi.component.html',
  styleUrls: ['./notifikasi.component.scss']
})
export class NotifikasiComponent implements OnInit {

  p: number = 1;
  cronURL = 'https://api.cron-job.org/';
  constructor(
    public api: ApiService,
    private router: Router,
    public http:HttpClient, 
    public common: CommonService,
    public routes: ActivatedRoute,
    public dialog: MatDialog,
    public datePipe: DatePipe,
  ) { 
  }

  dataLogin:any = {};
  serverImg:any;
  pageTitle:any;
  loading:boolean = false;
  ngOnInit(): void {
    this.loading = true;
    // Loading.pulse();
    this.dataLogin = JSON.parse(localStorage.getItem('salammuToken'));
    this.serverImg = this.common.photoBaseUrl+'notulenmu/';
    this.pageTitle = this.routes.snapshot.firstChild?.data.title;
    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.pageTitle = this.routes.snapshot.firstChild?.data.title;
      }
    });
    this.cekLogin();
  }

  userData:any;
  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
      this.getListCronjobs();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      localStorage.removeItem('salammuToken');
      this.router.navigate(['/auth/login'], {replaceUrl:true});
    })
  }

  //Gzd6H8qWSBHN+n4A6/DcI+yf7cQWSW6BDsF5JUGHxok=
  listCronjobs:any = [];
  getListCronjobs() {
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer Gzd6H8qWSBHN+n4A6/DcI+yf7cQWSW6BDsF5JUGHxok='
      })
    };
    
    this.http.get(this.cronURL+'jobs', httpOption).subscribe((res:any) => {
      this.listCronjobs = res['jobs'];
      this.listCronjobs = this.listCronjobs.filter((e:any) => {
        return e.url.includes('salammu');
      })
      this.listCronjobs.forEach((e:any) => {
        const date = this.datePipe.transform(new Date(e.lastExecution * 1000), 'EEEE, dd/MM/yyyy, hh:mm:ss a');
        e.lastExecutionFormated = date.toLocaleString();

        const date2 = this.datePipe.transform(new Date(e.nextExecution * 1000), 'EEEE, dd/MM/yyyy, hh:mm:ss a');
        e.nextExecutionFormated = date2.toLocaleString();
      });
      console.log(this.listCronjobs);
    })
  }

  searchText = '';
  onSearch() {
    this.p = 1;
  }

  openDialogManual() {
    const dialogRef = this.dialog.open(NotifmanualComponent, {
      width: '650px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDialog(n:any) {
    const dialogRef = this.dialog.open(DialogNotifikasiComponent, {
      width: '650px',
      data: {data:n},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
