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
import { FilterPengajianComponent } from './filter-pengajian/filter-pengajian.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pengajian',
  templateUrl: './pengajian.component.html',
  styleUrls: ['./pengajian.component.scss']
})
export class PengajianComponent implements OnInit {

  p: number = 1;
  constructor(
    public api: ApiService,
    private router: Router,
    public common: CommonService,
    public routes: ActivatedRoute,
    private datePipe: DatePipe,
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
  allPengajianTemp:any = [];
  getAllPengajian() {
    this.api.get('pengajian?all').then(res=>{
      this.allPengajian = res;
      this.allPengajianTemp = res;
      Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    });
  }

  searchText = '';
  onSearch() {
    this.p = 1;
  }

  //Dialog tambah/edit banner
  openDialog(data:any): void {
    const dialogRef = this.dialog.open(DialogPengajianComponent, {
      width: '650px',
      data: {data:data}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getAllPengajian();
    });
  }

  //Dialog verifikasi
  openDetail(data:any): void {
    const dialogRef = this.dialog.open(DetailPengajianComponent, {
      width: '650px',
      data: {data:data}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getAllPengajian();
    });
  }

  //Dialog filter
  selectedFiltered:any;
  openFilter(): void {
    const dialogRef = this.dialog.open(FilterPengajianComponent, {
      width: '550px',
      data: {data:this.selectedFiltered}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.selectedFiltered = result;
        this.filterPengajian();
      }
    });
  }

  async filterPengajian() {
    this.allPengajian = [];
    this.allPengajian = this.allPengajianTemp;
    
    let dateCreated = this.datePipe.transform(this.selectedFiltered.created_at, 'dd-MM-yyyy');
    if(this.selectedFiltered.created_at != undefined) {
      this.allPengajian = this.allPengajian.filter((item: any) => {
        let created_at = this.datePipe.transform(item.created_at, 'dd-MM-yyyy');
        return created_at == dateCreated;
      });

      if(this.selectedFiltered.tglPengajian != undefined) {
        let datePengajian = this.datePipe.transform(this.selectedFiltered.tglPengajian, 'dd-MM-yyyy');
        this.allPengajian = this.allPengajian.filter((item: any) => {
          let tglPengajian = this.datePipe.transform(item.datetime, 'dd-MM-yyyy');
          return tglPengajian == datePengajian;
        });
        this.filterStatus();
      } else {
        this.filterStatus();
      }
    } else if(this.selectedFiltered.tglPengajian != undefined) {
      let datePengajian = this.datePipe.transform(this.selectedFiltered.tglPengajian, 'dd-MM-yyyy');
        this.allPengajian = this.allPengajian.filter((item: any) => {
          let tglPengajian = this.datePipe.transform(item.datetime, 'dd-MM-yyyy');
          return tglPengajian == datePengajian;
        });
        this.filterStatus();
    } else {
      this.filterStatus();
    }
    this.p = 1;
  }

  filterStatus() {
    let status = '';
    if(this.selectedFiltered.status != 'all') {
      status = this.selectedFiltered.status == 'unverified' ? "0":"1";
    } else if(this.selectedFiltered.status != 'all') {
      status = this.selectedFiltered.status == 'unverified' ? "0":"1";
    } else if(this.selectedFiltered.status == 'all') {
      status = "all";
    } else {
      status = 'all';
    }
    
    if(status != 'all') {
      this.allPengajian = this.allPengajian.filter((e:any) => e.verified == status);
    }
  }

  hasSelectedData:boolean = false;
  selectAll(evt:any, n:any) {
    if(n == 'all') {
      if(evt.target.checked) {
        this.allPengajian.forEach((e:any) => {
          e.checked = true;
        });
      } else {
        this.allPengajian.forEach((e:any) => {
          e.checked = false;
        });
      }
    } else {
      if(evt.target.checked) {
        this.allPengajian[n].checked = true;
      } else {
        this.allPengajian[n].checked = false;
      }
    }
    let checkData = this.allPengajian.filter((e:any) => e.checked == true);
    checkData.length > 0 ? this.hasSelectedData = true : this.hasSelectedData = false;
  }

  allData:any = {};
  verifikasi() {
    let checkData = this.allPengajian.filter((e:any) => e.verified == 0 && e.checked == true);
    Swal.fire({
      title: 'Anda yakin ingin melanjutkan verifikasi data pengajian?',
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
          this.api.put('pengajian/'+ e.id, e).then(res => {
            if(res) {
              if(idx+1 == checkData.length) {
                Notiflix.Notify.success('Data Berhasil di Verifikasi.',{ timeout: 2000 });
                this.allPengajian.forEach((e:any) => {
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
      }
    })
  }

  batalVerif() {
    let checkData = this.allPengajian.filter((e:any) => e.verified == 1 && e.checked == true);
    Swal.fire({
      title: 'Anda yakin ingin melanjutkan membatalkan verifikasi data pengajian?',
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
          this.api.put('pengajian/'+ e.id, e).then(res => {
            if(res) {
              if(idx+1 == checkData.length) {
                Notiflix.Notify.success('Verifikasi Berhasil dibatalkan.',{ timeout: 2000 });
                this.allPengajian.forEach((e:any) => {
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
      }
    })
  }

  delete(data:any) {
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
        this.api.delete('pengajian/'+data.id).then(res => {
          if(res) {
            Notiflix.Notify.success('Berhasil menghapus data.',{ timeout: 2000 });
            this.getAllPengajian();
          }
        })
      }
    })
  }

}
