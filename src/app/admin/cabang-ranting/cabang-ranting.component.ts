import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import { DialogCabangRantingComponent } from './dialog-cabang-ranting/dialog-cabang-ranting.component';
import { DetailCabangRantingComponent } from './detail-cabang-ranting/detail-cabang-ranting.component';
import Swal from 'sweetalert2';


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
    this.allCr = [];
    this.api.get('cr').then(res=>{
      this.allCr = res;
      Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    });
  }

  //Dialog tambah/edit Cabang Ranting
  openDialog(n:any): void {
    const dialogRef = this.dialog.open(DialogCabangRantingComponent, {
      width: '650px',
      data: {data:n}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getAllCr();
    });
  }

  //Dialog detail Cabang Ranting
  detailDialog(n:any): void {
    const dialogRef = this.dialog.open(DetailCabangRantingComponent, {
      width: '650px',
      data: {data:n}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getAllCr();
    });
  }

  hasSelectedData:boolean = false;
  selectAll(evt:any, n:any) {
    if(n == 'all') {
      if(evt.target.checked) {
        this.allCr.forEach((e:any) => {
          e.checked = true;
        });
      } else {
        this.allCr.forEach((e:any) => {
          e.checked = false;
        });
      }
    } else {
      if(evt.target.checked) {
        this.allCr[n].checked = true;
      } else {
        this.allCr[n].checked = false;
      }
    }
    let checkData = this.allCr.filter((e:any) => e.checked == true);
    checkData.length > 0 ? this.hasSelectedData = true : this.hasSelectedData = false;
  }

  allData:any = {};
  verifikasi() {
    let checkData = this.allCr.filter((e:any) => e.verified == 0 && e.checked == true);
    Swal.fire({
      title: 'Anda yakin ingin melanjutkan verifikasi data cabang/ranting?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, Verifikasi!'
    }).then((result) => {
      if (result.isConfirmed) {
        Loading.pulse();
        checkData.forEach((e:any, idx:any) => {
          e.verified = true;
          this.api.put('cr/'+ e.id, e).then(res => {
            if(res) {
              if(idx+1 == checkData.length) {
                Notiflix.Notify.success('Data Berhasil di Verifikasi.',{ timeout: 2000 });
                this.allCr.forEach((e:any) => {
                  e.checked = false;
                });
                this.allData.checked = false;
                this.hasSelectedData = false;
                Loading.remove();
              }
            }
          })
        });
      } else {
        Notiflix.Notify.failure('Aksi dibatalkan.',{ timeout: 2000 });
      }
    })
  }

  batalVerif() {
    let checkData = this.allCr.filter((e:any) => e.verified == 1 && e.checked == true);
    Swal.fire({
      title: 'Anda yakin ingin melanjutkan membatalkan verifikasi data cabang/ranting?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, Batalkan!'
    }).then((result) => {
      if (result.isConfirmed) {
        Loading.pulse();
        checkData.forEach((e:any, idx:any) => {
          e.verified = false;
          this.api.put('cr/'+ e.id, e).then(res => {
            if(res) {
              if(idx+1 == checkData.length) {
                Notiflix.Notify.success('Verifikasi Berhasil dibatalkan.',{ timeout: 2000 });
                this.allCr.forEach((e:any) => {
                  e.checked = false;
                });
                this.allData.checked = false;
                this.hasSelectedData = false;
                Loading.remove();
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
        this.api.delete('cr/'+n.id).then(res => {
          if(res) {
            Notiflix.Notify.success('Berhasil menghapus data.',{ timeout: 2000 });
            this.getAllCr();
          }
        }, err => {
          Loading.remove();
        })
      } else {
        Notiflix.Notify.failure('Aksi dibatalkan.',{ timeout: 2000 });
      }
    })
  }

}
