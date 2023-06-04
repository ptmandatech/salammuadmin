import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { DialogKonfigurasiComponent } from './dialog-konfigurasi/dialog-konfigurasi.component';

@Component({
  selector: 'app-konfigurasi',
  templateUrl: './konfigurasi.component.html',
  styleUrls: ['./konfigurasi.component.scss']
})
export class KonfigurasiComponent implements OnInit {

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
  loading:boolean = false;
  ngOnInit(): void {
    this.loading = true;
    // Loading.pulse();
    this.serverImg = this.common.photoBaseUrl+'categories/';
    this.pageTitle = this.routes.snapshot.firstChild?.data.title;
    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.pageTitle = this.routes.snapshot.firstChild?.data.title;
      }
    });
    this.cekLogin();
    this.getConfig();
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

  searchText = '';
  onSearch() {
    this.p = 1;
  }

  allConfig:any = [];
  getConfig() {
    this.allConfig = [];
    this.api.get('config').then(res=>{
      this.allConfig = res;
      this.loading = false;
      this.allConfig.forEach((n:any) => {
        if(n.value == '1' || n.value == '0') {
          n.isActive = n.value == '1' ? true:false;
        }
      });
      // Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      this.loading = false;
      // Loading.remove();
    });
  }

  //Dialog tambah/edit Cabang Ranting
  openDialog(n:any): void {
    const dialogRef = this.dialog.open(DialogKonfigurasiComponent, {
      width: '650px',
      disableClose: true,
      data: {data:n}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getConfig();
    });
  }

  changeStatus(n:any) {
    if(n.isActive) {
      n.value = '1';
    } else {
      n.value = '0';
    }
    this.api.put('config/'+n.key, n).then(res => {
      if(res) {
        Notiflix.Notify.success('Berhasil memperbarui data.',{ timeout: 2000 });
        this.getConfig();
      }
    })
  }

  delete(n:any) {
    Swal.fire({
      title: 'Anda Yakin ingin menghapus data ?',
      text: "Data yang telah terhapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.delete('config/'+n.id).then(res => {
          if(res) {
            Notiflix.Notify.success('Berhasil menghapus data.',{ timeout: 2000 });
            this.getConfig();
          }
        })
      } else {
        Notiflix.Notify.failure('Aksi dibatalkan.',{ timeout: 2000 });
      }
    })
  }

}
