import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { DialogDoaDzikirComponent } from './dialog-doa-dzikir/dialog-doa-dzikir.component';

@Component({
  selector: 'app-doa-dzikir',
  templateUrl: './doa-dzikir.component.html',
  styleUrls: ['./doa-dzikir.component.scss']
})
export class DoaDzikirComponent implements OnInit {

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
    this.serverImg = this.common.photoBaseUrl+'doadzikir/';
    this.pageTitle = this.routes.snapshot.firstChild?.data.title;
    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.pageTitle = this.routes.snapshot.firstChild?.data.title;
      }
    });
    this.cekLogin();
    this.getAllDoaDzikir();
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

  allDoaDzikir:any = [];
  getAllDoaDzikir() {
    this.allDoaDzikir = [];
    this.api.get('Doadzikir').then(res=>{
      this.allDoaDzikir = res;
      this.allDoaDzikir.forEach((e:any) => {
        e.checked = false;
      });
      this.loading = false;
      // Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      this.loading = false;
      // Loading.remove();
    });
  }

  //Dialog tambah/edit Cabang Ranting
  openDialog(n:any): void {
    const dialogRef = this.dialog.open(DialogDoaDzikirComponent, {
      width: '650px',
      disableClose: true,
      data: {data:n}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.allData.checked = false;
      this.hasSelectedData = false;
      this.getAllDoaDzikir();
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
        this.api.delete('Doadzikir/'+n.id).then(res => {
          if(res) {
            Notiflix.Notify.success('Berhasil menghapus data.',{ timeout: 2000 });
            this.allData.checked = false;
            this.hasSelectedData = false;
            this.getAllDoaDzikir();
          }
        })
      } else {
        Notiflix.Notify.failure('Aksi dibatalkan.',{ timeout: 2000 });
        this.allData.checked = false;
        this.hasSelectedData = false;
      }
    })
  }

  hasSelectedData:boolean = false;
  selectAll(evt:any, n:any) {
    if(n == 'all') {
      if(evt.target.checked) {
        this.allDoaDzikir.forEach((e:any) => {
          e.checked = true;
        });
      } else {
        this.allDoaDzikir.forEach((e:any) => {
          e.checked = false;
        });
      }
    } else {
      if(evt.target.checked) {
        this.allDoaDzikir[n].checked = true;
      } else {
        this.allDoaDzikir[n].checked = false;
      }
    }
    let checkData = this.allDoaDzikir.filter((e:any) => e.checked == true);
    checkData.length > 0 ? this.hasSelectedData = true : this.hasSelectedData = false;
  }

  batalVerif() {
    let checkData = this.allDoaDzikir.filter((e:any) => e.verified == 1 && e.checked == true);
    if(checkData.length > 0) {
      Swal.fire({
        title: 'Anda yakin ingin melanjutkan membatalkan verifikasi data doa dan dzikir?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2196F3',
        cancelButtonColor: '#F44336',
        confirmButtonText: 'Ya, Batalkan!',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          // Loading.pulse();
          checkData.forEach((e:any, idx:any) => {
            e.verified = false;
            e.images = JSON.stringify(e.images);
            this.api.put('Doadzikir/'+ e.id, e).then(res => {
              if(res) {
                if(idx+1 == checkData.length) {
                  this.getAllDoaDzikir();
                  Notiflix.Notify.success('Verifikasi Berhasil dibatalkan.',{ timeout: 2000 });
                  this.allDoaDzikir.forEach((e:any) => {
                    e.checked = false;
                  });
                  this.allData.checked = false;
                  this.hasSelectedData = false;
                }
              }
            }, err => {
              this.loading = false;
              // Loading.remove();
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
    let checkData = this.allDoaDzikir.filter((e:any) => e.verified == 0 && e.checked == true);
    if(checkData.length > 0) {
      Swal.fire({
        title: 'Anda yakin ingin melanjutkan verifikasi data doa dan dzikir?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2196F3',
        cancelButtonColor: '#F44336',
        confirmButtonText: 'Ya, Verifikasi!',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          // Loading.pulse();
          checkData.forEach((e:any, idx:any) => {
            e.verified = true;
            e.images = JSON.stringify(e.images);
            this.api.put('Doadzikir/'+ e.id, e).then(res => {
              if(res) {
                if(idx+1 == checkData.length) {
                  this.getAllDoaDzikir();
                  Notiflix.Notify.success('Data Berhasil di Verifikasi.',{ timeout: 2000 });
                  this.allDoaDzikir.forEach((e:any) => {
                    e.checked = false;
                  });
                  this.allData.checked = false;
                  this.hasSelectedData = false;
                }
              }
            }, err => {
              this.loading = false;
              // Loading.remove();
            })
          });
          let payload = {
            title: checkData[0].title,
            body: checkData[0].summary,
            image: this.serverImg+checkData[0].image
          }
          this.api.post('fcm/sendNotifUpdate', payload).then(res => {})
        } else {
          Notiflix.Notify.failure('Aksi dibatalkan.',{ timeout: 2000 });
        }
      })
    } else {
      Notiflix.Notify.success('Data terpilih sudah di Verifikasi.',{ timeout: 2000 });
    }
  }

}
