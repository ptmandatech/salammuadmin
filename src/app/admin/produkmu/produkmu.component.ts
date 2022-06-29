import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { DialogProdukmuComponent } from './dialog-produkmu/dialog-produkmu.component';

@Component({
  selector: 'app-produkmu',
  templateUrl: './produkmu.component.html',
  styleUrls: ['./produkmu.component.scss']
})
export class ProdukmuComponent implements OnInit {

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
    this.serverImg = this.common.photoBaseUrl+'products/';
    this.pageTitle = this.routes.snapshot.firstChild?.data.title;
    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.pageTitle = this.routes.snapshot.firstChild?.data.title;
      }
    });
    this.cekLogin();
    this.getProducts();
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

  allProducts:any = [];
  getProducts() {
    Loading.pulse();
    this.allProducts = [];
    this.api.get('products').then(res=>{
      res.forEach((e:any) => {
        e.images = JSON.parse(e.images)
      });
      this.allProducts = res;
      Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    });
  }

  checkImage(url:any, image:any) {
    if(image != null && image != "") {
      let image2 = JSON.parse(image);
      return url + image2[0];
    }
  }

  //Dialog tambah/edit Cabang Ranting
  openDialog(n:any): void {
    const dialogRef = this.dialog.open(DialogProdukmuComponent, {
      width: '650px',
      data: {data:n}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getProducts();
    });
  }

  verifikasi(n:any, status:any) {
    let s = status == true ? 'melanjutkan verifikasi':'membatalkan verifikasi';
    let t = status == true ? 'Verifikasi':'Batalkan Verifikasi';
    Swal.fire({
      title: 'Anda yakin ingin '+s+' data produk?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, '+t+'!'
    }).then((result) => {
      if (result.isConfirmed) {
        n.verified = status;
        this.api.put('products/'+ n.id, n).then(res => {
          if(res) {
            Notiflix.Notify.success('Data Berhasil di '+t+'.',{ timeout: 2000 });
            this.getProducts()
          }
        }).catch(error => {
          Notiflix.Notify.success('Data Gagal di '+t+'.',{ timeout: 2000 });
        })
      }
    })
  }

  block(n:any, status:any) {
    let s = status == true ? 'memblokir':'membuka blokir';
    let t = status == true ? 'Blokir':'Buka Blokir';
    Swal.fire({
      title: 'Anda yakin ingin '+s+' produk?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, '+t+'!'
    }).then((result) => {
      if (result.isConfirmed) {
        n.blocked = status;
        this.api.put('products/'+ n.id, n).then(res => {
          if(res) {
            Notiflix.Notify.success('Data Berhasil di '+t+'.',{ timeout: 2000 });
            this.getProducts()
          }
        }).catch(error => {
          Notiflix.Notify.success('Data Gagal di '+t+'.',{ timeout: 2000 });
        })
      }
    })
  }

  hasSelectedData:boolean = false;
  selectAll(evt:any, n:any) {
    if(n == 'all') {
      if(evt.target.checked) {
        this.allProducts.forEach((e:any) => {
          e.checked = true;
        });
      } else {
        this.allProducts.forEach((e:any) => {
          e.checked = false;
        });
      }
    } else {
      if(evt.target.checked) {
        this.allProducts[n].checked = true;
      } else {
        this.allProducts[n].checked = false;
      }
    }
    let checkData = this.allProducts.filter((e:any) => e.checked == true);
    checkData.length > 0 ? this.hasSelectedData = true : this.hasSelectedData = false;
  }

  allData:any = {};
  verifikasiAll() {
    let checkData = this.allProducts.filter((e:any) => e.verified == 0 && e.checked == true);
    Swal.fire({
      title: 'Anda yakin ingin melanjutkan verifikasi data produk?',
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
          e.images = JSON.stringify(e.images);
          this.api.put('products/'+ e.id, e).then(res => {
            if(res) {
              if(idx+1 == checkData.length) {
                this.getProducts();
                Notiflix.Notify.success('Data Berhasil di Verifikasi.',{ timeout: 2000 });
                this.allProducts.forEach((e:any) => {
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
      }
    })
  }

  batalVerif() {
    let checkData = this.allProducts.filter((e:any) => e.verified == 1 && e.checked == true);
    Swal.fire({
      title: 'Anda yakin ingin melanjutkan membatalkan verifikasi data produk?',
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
          e.images = JSON.stringify(e.images);
          this.api.put('products/'+ e.id, e).then(res => {
            if(res) {
              if(idx+1 == checkData.length) {
                this.getProducts();
                Notiflix.Notify.success('Verifikasi Berhasil dibatalkan.',{ timeout: 2000 });
                this.allProducts.forEach((e:any) => {
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
      confirmButtonText: 'Ya, hapus!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.delete('products/'+n.id).then(res => {
          if(res) {
            Notiflix.Notify.success('Berhasil menghapus data.',{ timeout: 2000 });
            this.getProducts();
          }
        })
      }
    })
  }

}
