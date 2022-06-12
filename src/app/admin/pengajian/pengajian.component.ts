import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPengajianComponent } from './dialog-pengajian/dialog-pengajian.component';
import Swal from 'sweetalert2';
import { DetailPengajianComponent } from './detail-pengajian/detail-pengajian.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-pengajian',
  templateUrl: './pengajian.component.html',
  styleUrls: ['./pengajian.component.scss']
})
export class PengajianComponent implements OnInit {

  constructor(
    public api: ApiService,
    private router: Router,
    public common: CommonService,
    public routes: ActivatedRoute,
    public dialog: MatDialog,
  ) { }

  pageTitle:any;
  serverImgBanner:any;
  ngOnInit(): void {
    Loading.pulse();
    this.serverImgBanner = this.common.photoBaseUrl+'banners/';
    this.pageTitle = this.routes.snapshot.firstChild?.data.title;
    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.pageTitle = this.routes.snapshot.firstChild?.data.title;
      }
    });
    this.cekLogin();
    this.getAllPengajian();
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

  allPengajian:any = [];
  getAllPengajian() {
    this.api.get('pengajian?all').then(res=>{
      this.allPengajian = res;
      console.log(res)
      Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    });
  }

  //Dialog tambah/edit banner
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogPengajianComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  //Dialog verifikasi
  openDetail(): void {
    const dialogRef = this.dialog.open(DetailPengajianComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  delete() {
    Swal.fire({
      title: 'Anda Yakin ingin menghapus data ?',
      text: "Data yang telah terhapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, hapus!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Data Berhasil di Hapus',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

}
