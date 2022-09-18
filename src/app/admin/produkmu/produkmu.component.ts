import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { DialogProdukmuComponent } from './dialog-produkmu/dialog-produkmu.component';
import { FilterProdukComponent } from './filter-produk/filter-produk.component';

@Component({
  selector: 'app-produkmu',
  templateUrl: './produkmu.component.html',
  styleUrls: ['./produkmu.component.scss']
})
export class ProdukmuComponent implements OnInit {

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
    this.serverImg = this.common.photoBaseUrl+'products/';
    this.pageTitle = this.routes.snapshot.firstChild?.data.title;
    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.pageTitle = this.routes.snapshot.firstChild?.data.title;
      }
    });
    this.getCategories();
    this.cekLogin();
  }

  userData:any;
  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
      this.getProducts();
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

  allProducts:any = [];
  allProductsTemp:any = [];
  getProducts() {
    Loading.pulse();
    this.allProducts = [];
    if(this.userData.role != 'user' || this.userData.role != '1656596135011345') {
      this.api.get('products/getFromAdmin').then(res=>{
        res.forEach((e:any) => {
          e.images = JSON.parse(e.images)
        });
        this.allProducts = res;
        this.allProductsTemp = res;
        Loading.remove();
      }, err => {
        Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
        Loading.remove();
      });
    } else {
      this.api.get('products').then(res=>{
        res.forEach((e:any) => {
          e.images = JSON.parse(e.images)
        });
        this.allProducts = res;
        this.allProductsTemp = res;
        Loading.remove();
      }, err => {
        Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
        Loading.remove();
      });
    }
  }

  allCategories:any = {};
  getCategories() {
    this.api.get('categories').then(res=>{
      this.parseCategories(res);
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
    });
  }

  parseCategories(res:any) {
    for(var i=0; i<res.length; i++) {
      this.allCategories[res[i].id] = res[i];
    }
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

  //Dialog filter
  selectedFiltered:any;
  openFilter(): void {
    const dialogRef = this.dialog.open(FilterProdukComponent, {
      width: '550px',
      data: {data:this.selectedFiltered}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.selectedFiltered = result;
        this.filterProducts();
      }
    });
  }

  filterProducts() {
    this.allProducts = [];
    this.allProducts = this.allProductsTemp;
    let fav = '';
    let status = '';
    if(this.selectedFiltered.fav != 'all' && this.selectedFiltered.status != 'all') {
      fav = this.selectedFiltered.fav == 'nofav' ? "0":"1";
      status = this.selectedFiltered.status == 'unverified' ? "0":"1";
    } else if(this.selectedFiltered.fav == 'all' && this.selectedFiltered.status != 'all') {
      fav = "all";
      status = this.selectedFiltered.status == 'unverified' ? "0":"1";
    } else if(this.selectedFiltered.fav != 'all' && this.selectedFiltered.status == 'all') {
      fav = this.selectedFiltered.fav == 'nofav' ? "0":"1";
      status = "all";
    } else {
      fav = 'all';
      status = 'all';
    }
    
    if(fav != 'all' && status != 'all' && fav != '0' && status != '0') {
      this.allProducts = this.allProducts.filter((e:any) => e.fav == fav && e.verified == status);
    } else if(fav != 'all' && status != 'all' && fav != '1' && status != '1') {
      this.allProducts = this.allProducts.filter((e:any) => e.fav == fav && e.verified == status);
    } else if(fav == 'all' && status != 'all') {
      this.allProducts = this.allProducts.filter((e:any) => e.verified == status);
    } else if(fav != 'all' && status == 'all') {
      this.allProducts = this.allProducts.filter((e:any) => e.fav == fav);
    } else if(fav == '0' && status != '0' || fav == '1' && status != '1') {
      this.allProducts = this.allProducts.filter((e:any) => e.fav == fav && e.verified == status);
    }
    this.p = 1;
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
      confirmButtonText: 'Ya, '+t+'!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        n.verified = status;
        n.images = JSON.stringify(n.images);
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
      confirmButtonText: 'Ya, '+t+'!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        n.blocked = status;
        n.images = JSON.stringify(n.images);
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

  fav(n:any) {
    let s = n.fav == true ? 'menghapus favorit':'menambahkan favorit';
    Swal.fire({
      title: 'Anda yakin ingin '+s+' produk?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, Simpan!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        n.fav = n.fav == true ? n.fav = false:n.fav = true;
        n.images = JSON.stringify(n.images);
        this.api.put('products/'+ n.id, n).then(res => {
          if(res) {
            Notiflix.Notify.success('Data Berhasil disimpan',{ timeout: 2000 });
            this.getProducts()
          }
        }).catch(error => {
          Notiflix.Notify.success('Data Gagal disimpan',{ timeout: 2000 });
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
      confirmButtonText: 'Ya, Verifikasi!',
      cancelButtonText: 'Batal'
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
      confirmButtonText: 'Ya, Batalkan!',
      cancelButtonText: 'Batal'
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
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
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
