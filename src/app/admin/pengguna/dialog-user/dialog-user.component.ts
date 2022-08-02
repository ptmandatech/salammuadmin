import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.scss']
})
export class DialogUserComponent implements OnInit {

  usersData: any = {};
  isCreated:boolean;
  serverImg:any;
  id:any;
  imageNow:any = [];
  constructor(
    public common: CommonService,
    public dialogRef: MatDialogRef<DialogUserComponent>,
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
  }

  userData:any;
  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
    });
  }

  save() {
    Swal.fire({
      title: 'Anda yakin ingin menyimpan data pengguna?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, Simpan!'
    }).then((result) => {
      if (result.isConfirmed) {
        if(this.isCreated == true) {
          this.usersData.is_active = 1;
          this.usersData.date_created = new Date();
          this.usersData.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
          this.usersData.role = 'user';
          this.usersData.password = this.usersData.phone;
          this.api.post('auth/register/', this.usersData).then(res => {
            if(res) {
              Notiflix.Notify.success('Berhasil menambahkan pengguna.',{ timeout: 2000 });
              this.dialogRef.close();
            }
          })
        } else {
          this.api.put('users/'+this.usersData.id, this.usersData).then(res => {
            if(res) {
              Notiflix.Notify.success('Berhasil memperbarui pengguna.',{ timeout: 2000 });
              this.dialogRef.close();
            }
          })
        }
      }
    })
  }

}
