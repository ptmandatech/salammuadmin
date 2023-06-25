import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogSettingRoleComponent } from './dialog-setting-role/dialog-setting-role.component';
import { DialogUpdatePasswordComponent } from './dialog-update-password/dialog-update-password.component';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { FilterPenggunaComponent } from './filter-pengguna/filter-pengguna.component';

@Component({
  selector: 'app-pengguna',
  templateUrl: './pengguna.component.html',
  styleUrls: ['./pengguna.component.scss']
})
export class PenggunaComponent implements OnInit {

  conterColClick:any = { name: 0, email: 0, phone: 0, is_active: 0, asManagement: 0, role: 0, date_created: 0 };
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
    // Loading.pulse();
    this.loading = true;
    this.serverImg = this.common.photoBaseUrl+'users/';
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
      this.getAllRoles();
      this.getAllUsers();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      localStorage.removeItem('salammuToken');
      this.router.navigate(['/auth/login'], {replaceUrl:true});
    })
  }

  allRoles:any = {};
  getAllRoles() {
    this.api.get('roles?all').then(res=>{
      this.parseRoles(res);
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
    });
  }

  parseRoles(res:any) {
    for(var i=0; i<res.length; i++) {
      this.allRoles[res[i].id] = res[i];
    }
  }

  searchText = '';
  onSearch() {
    this.p = 1;
  }
  
  sortByColumn(col: string) {
    if (this.allUsers.length == 0) return;
    if (this.conterColClick[col] % 2 == 0) {
      this.allUsers.sort((a:any, b:any) => a[col] < b[col] ? -1 : 1)
    } else {
      this.allUsers.sort((a:any, b:any) => a[col] > b[col] ? -1 : 1)
    }
    this.conterColClick[col]++;
  }

  allUsers:any = [];
  allUsersTemp:any = [];
  getAllUsers() {
    // Loading.pulse();
    this.loading = true;
    this.allUsers = [];
    this.api.get('users/'+this.userData.id).then(res=>{
      this.allUsers = res;
      this.allUsersTemp = res;
      // Loading.remove();
      this.loading = false;
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      // Loading.remove();
      this.loading = false;
    });
  }

  checkImage(url:any, image:any) {
    if(image != null && image != "") {
      let image2 = JSON.parse(image);
      return url + image2[0];
    }
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
        this.api.put('users/'+ n.id, n).then(res => {
          if(res) {
            Notiflix.Notify.success('Data Berhasil di '+t+'.',{ timeout: 2000 });
            this.getAllUsers()
          }
        }).catch(error => {
          Notiflix.Notify.success('Data Gagal di '+t+'.',{ timeout: 2000 });
        })
      } else {
        Notiflix.Notify.failure('Aksi dibatalkan.',{ timeout: 2000 });
      }
    })
  }

  block(n:any, status:any) {
    let s = status != true ? 'memblokir':'membuka blokir';
    let t = status != true ? 'Blokir':'Buka Blokir';
    Swal.fire({
      title: 'Anda yakin ingin '+s+' '+n.name+'?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, '+t+'!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        n.is_active = status;
        this.api.put('users/'+ n.id, n).then(res => {
          if(res) {
            Notiflix.Notify.success('Data Berhasil di '+t+'.',{ timeout: 2000 });
            this.getAllUsers()
          }
        }).catch(error => {
          Notiflix.Notify.success('Data Gagal di '+t+'.',{ timeout: 2000 });
        })
      } else {
        Notiflix.Notify.failure('Aksi dibatalkan.',{ timeout: 2000 });
      }
    })
  }

  delete(n:any) {
    Swal.fire({
      title: 'Anda Yakin ingin menghapus pengguna ini ?',
      text: "Data yang telah terhapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.delete('users/'+n.id).then(res => {
          if(res) {
            Notiflix.Notify.success('Berhasil menghapus data.',{ timeout: 2000 });
            this.getAllUsers();
          }
        })
      } else {
        Notiflix.Notify.failure('Aksi dibatalkan.',{ timeout: 2000 });
      }
    })
  }

  //Dialog Tambah/Edit Pengguna
  dialogPengguna(n:any): void {
    const dialogRef = this.dialog.open(DialogUserComponent, {
      width: '650px',
      disableClose: true,
      data: {data:n}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getAllUsers();
    });
  }
  
  //Dialog Edit Role
  editRole(n:any): void {
    const dialogRef = this.dialog.open(DialogSettingRoleComponent, {
      width: '650px',
      disableClose: true,
      data: {data:n}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  //Dialog Edit Password
  updatePassword(n:any): void {
    const dialogRef = this.dialog.open(DialogUpdatePasswordComponent, {
      width: '650px',
      disableClose: true,
      data: {data:n}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  //Dialog filter
  selectedFiltered:any;
  openFilter(): void {
    const dialogRef = this.dialog.open(FilterPenggunaComponent, {
      width: '550px',
      disableClose: true,
      data: {data:this.selectedFiltered}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.selectedFiltered = result;
        this.filterUsers();
      }
    });
  }

  filterUsers() {
    this.allUsers = [];
    this.allUsers = this.allUsersTemp;
    let role = '';
    let status = '';
    if(this.selectedFiltered.role != 'all' && this.selectedFiltered.status != 'all') {
      role = this.selectedFiltered.role;
      status = this.selectedFiltered.status;
    } else if(this.selectedFiltered.role == 'all' && this.selectedFiltered.status != 'all') {
      role = "all";
      status = this.selectedFiltered.status;
    } else if(this.selectedFiltered.role != 'all' && this.selectedFiltered.status == 'all') {
      role = this.selectedFiltered.role;
      status = "all";
    } else {
      role = 'all';
      status = 'all';
    }
    
    if(role != 'all' && status != 'all' && role != '0' && status != '0') {
      this.allUsers = this.allUsers.filter((e:any) => e.role == role && e.is_active == status);
    } else if(role != 'all' && status != 'all' && role != '1' && status != '1') {
      this.allUsers = this.allUsers.filter((e:any) => e.role == role && e.is_active == status);
    } else if(role == 'all' && status != 'all') {
      this.allUsers = this.allUsers.filter((e:any) => e.is_active == status);
    } else if(role != 'all' && status == 'all') {
      this.allUsers = this.allUsers.filter((e:any) => e.role == role);
    } else if(role == '0' && status != '0' || role == '1' && status != '1') {
      this.allUsers = this.allUsers.filter((e:any) => e.role == role && e.is_active == status);
    }
    this.p = 1;
    if(this.allUsers.length == 0) {
      Notiflix.Notify.failure('Data tidak ditemukan.',{ timeout: 2000 });
    }
  }

}
