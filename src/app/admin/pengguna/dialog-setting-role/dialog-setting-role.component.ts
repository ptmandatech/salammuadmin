import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-dialog-setting-role',
  templateUrl: './dialog-setting-role.component.html',
  styleUrls: ['./dialog-setting-role.component.scss']
})
export class DialogSettingRoleComponent implements OnInit {

  role = new FormControl('');
  RoleList = [
    {
      id: 'user',
      name: 'Pengguna'
    },
    {
      id: 'superadmin',
      name: 'Superadmin'
    }, 
    {
      id: 'admin_produk',
      name: 'Admin Produk'
    }, 
    {
      id: 'admin_CR',
      name: 'Admin CR'
    }
  ];

  usersData: any = {};
  isCreated:boolean;
  serverImg:any;
  id:any;
  imageNow:any = [];
  constructor(
    public common: CommonService,
    public dialogRef: MatDialogRef<DialogSettingRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.serverImg = this.common.photoBaseUrl+'users/';
    this.usersData = sourceData.data;
    if(this.usersData == null) {
      this.usersData = {};
      this.isCreated = true;
      this.id = new Date().getTime().toString();
    } else {
      this.isCreated = false;
      this.id = this.usersData.id;
    }
    Loading.remove();
  }

  ngOnInit(): void {
    this.cekLogin();
    this.getAllRoles();
  }

  userData:any;
  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
    });
  }

  allRoles:any = [];
  getAllRoles() {
    this.api.get('roles?all').then(res=>{
      this.allRoles = res;
      this.allRoles.forEach((e:any, index:any) => {
        e.path = JSON.parse(e.path);
      });
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
    });
  }

  save() {
    Swal.fire({
      title: 'Anda yakin ingin menyimpan data role pengguna?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, Simpan!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.put('users/'+this.usersData.id, this.usersData).then(res => {
          if(res) {
            Notiflix.Notify.success('Berhasil memperbarui pengguna.',{ timeout: 2000 });
            this.dialogRef.close();
          }
        })
      }
    })
  }

}
