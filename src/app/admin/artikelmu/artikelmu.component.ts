import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { DialogArtikelmuComponent } from './dialog-artikelmu/dialog-artikelmu.component';

@Component({
  selector: 'app-artikelmu',
  templateUrl: './artikelmu.component.html',
  styleUrls: ['./artikelmu.component.scss']
})
export class ArtikelmuComponent implements OnInit {

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
    this.serverImg = this.common.photoBaseUrl+'articles/';
    this.pageTitle = this.routes.snapshot.firstChild?.data.title;
    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.pageTitle = this.routes.snapshot.firstChild?.data.title;
      }
    });
    this.cekLogin();
    this.getArticles();
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

  allArticles:any = [];
  getArticles() {
    this.allArticles = [];
    this.api.get('articles').then(res=>{
      this.allArticles = res;
      this.allArticles.forEach((e:any) => {
        e.checked = false;
      });
      Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    });
  }

  //Dialog tambah/edit Cabang Ranting
  openDialog(n:any): void {
    const dialogRef = this.dialog.open(DialogArtikelmuComponent, {
      width: '650px',
      disableClose: true,
      data: {data:n}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.allData.checked = false;
      this.hasSelectedData = false;

      this.getArticles();
    });
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
        this.api.delete('articles/'+n.id).then(res => {
          if(res) {
            Notiflix.Notify.success('Berhasil menghapus data.',{ timeout: 2000 });
            this.allData.checked = false;
            this.hasSelectedData = false;
            this.getArticles();
          }
        })
      } else {
        this.allData.checked = false;
        this.hasSelectedData = false;
        Notiflix.Notify.failure('Aksi dibatalkan.',{ timeout: 2000 });
      }
    })
  }

  hasSelectedData:boolean = false;
  selectAll(evt:any, n:any) {
    if(n == 'all') {
      if(evt.target.checked) {
        this.allArticles.forEach((e:any) => {
          e.checked = true;
        });
      } else {
        this.allArticles.forEach((e:any) => {
          e.checked = false;
        });
      }
    } else {
      if(evt.target.checked) {
        this.allArticles[n].checked = true;
      } else {
        this.allArticles[n].checked = false;
      }
    }
    let checkData = this.allArticles.filter((e:any) => e.checked == true);
    checkData.length > 0 ? this.hasSelectedData = true : this.hasSelectedData = false;
  }

  batalVerif() {
    let checkData = this.allArticles.filter((e:any) => e.verified == 1 && e.checked == true);
    if(checkData.length > 0) {
      Swal.fire({
        title: 'Anda yakin ingin menghapus persetujuan data ArtikelMU?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2196F3',
        cancelButtonColor: '#F44336',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          Loading.pulse();
          checkData.forEach((e:any, idx:any) => {
            e.verified = false;
            e.images = JSON.stringify(e.images);
            this.api.put('articles/'+ e.id, e).then(res => {
              if(res) {
                if(idx+1 == checkData.length) {
                  this.getArticles();
                  Notiflix.Notify.success('Verifikasi Berhasil dibatalkan.',{ timeout: 2000 });
                  this.allArticles.forEach((e:any) => {
                    e.checked = false;
                  });
                  this.allData.checked = false;
                  this.hasSelectedData = false;
                }
              }
            }, err => {
              Loading.remove();
            })
          });
        } else {
          Notiflix.Notify.failure('Aksi dibatalkan.',{ timeout: 2000 });
        }
      })
    } else {
      Notiflix.Notify.success('Verifikasi data terpilih sudah dibatalkan.',{ timeout: 2000 });
    }
  }

  allData:any = {};
  verifikasiAll() {
    let checkData = this.allArticles.filter((e:any) => e.verified == 0 && e.checked == true);
    if(checkData.length > 0) {
      Swal.fire({
        title: 'Anda yakin ingin melanjutkan verifikasi data ArtikelMU?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2196F3',
        cancelButtonColor: '#F44336',
        confirmButtonText: 'Ya, Verifikasi!',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          Loading.pulse();
          checkData.forEach((e:any, idx:any) => {
            e.verified = true;
            e.images = JSON.stringify(e.images);
            this.api.put('articles/'+ e.id, e).then(res => {
              if(res) {
                if(idx+1 == checkData.length) {
                  this.getArticles();
                  Notiflix.Notify.success('Data Berhasil di Verifikasi.',{ timeout: 2000 });
                  this.allArticles.forEach((e:any) => {
                    e.checked = false;
                  });
                  this.allData.checked = false;
                  this.hasSelectedData = false;
                }
              }
            }, err => {
              Loading.remove();
            })
          });
        } else {
          Notiflix.Notify.failure('Aksi dibatalkan.',{ timeout: 2000 });
        }
      })
    } else {
      Notiflix.Notify.success('Data terpilih sudah di Verifikasi.',{ timeout: 2000 });
    }
  }

}
