import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { DialogKeilmuanUstadzComponent } from './dialog-keilmuan-ustadz/dialog-keilmuan-ustadz.component';

@Component({
  selector: 'app-keilmuan-ustadz',
  templateUrl: './keilmuan-ustadz.component.html',
  styleUrls: ['./keilmuan-ustadz.component.scss']
})
export class KeilmuanUstadzComponent implements OnInit {

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
    this.pageTitle = this.routes.snapshot.firstChild?.data.title;
    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.pageTitle = this.routes.snapshot.firstChild?.data.title;
      }
    });
    this.cekLogin();
    this.getSciences();
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

  allSciences:any = [];
  getSciences() {
    this.allSciences = [];
    this.api.get('sciences').then(res=>{
      this.allSciences = res;
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
    const dialogRef = this.dialog.open(DialogKeilmuanUstadzComponent, {
      width: '650px',
      disableClose: true,
      data: {data:n}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getSciences();
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
        this.api.delete('sciences/'+n.id).then(res => {
          if(res) {
            Notiflix.Notify.success('Berhasil menghapus data.',{ timeout: 2000 });
            this.getSciences();
          }
        })
      } else {
        Notiflix.Notify.failure('Aksi dibatalkan.',{ timeout: 2000 });
      }
    })
  }

}
