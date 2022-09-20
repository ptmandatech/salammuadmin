import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-update-password',
  templateUrl: './dialog-update-password.component.html',
  styleUrls: ['./dialog-update-password.component.scss']
})
export class DialogUpdatePasswordComponent implements OnInit {

  usersData: any = {};
  isCreated:boolean;
  serverImg:any;
  id:any;
  imageNow:any = [];
  constructor(
    public common: CommonService,
    public dialogRef: MatDialogRef<DialogUpdatePasswordComponent>,
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

  user:any = {};
  match:boolean;
  loading:boolean;
  submited:boolean;
  checkMatch() {
    this.user.password2 == this.user.password ? this.match = true:this.match = false;
  }

  showPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  save() {
    this.loading = true;
    if(this.user.password.length >= 6)
    {
      Swal.fire({
        title: 'Anda yakin ingin memperbarui password pengguna?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2196F3',
        cancelButtonColor: '#F44336',
        confirmButtonText: 'Ya, Simpan!',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          this.usersData.password = this.user.password;
          this.api.put('users/changePass/'+this.usersData.id, this.usersData).then(async res => {
            if(res) {
              this.loading = false;
              Notiflix.Notify.success('Berhasil memperbarui password.',{ timeout: 2000 });
              this.dialogRef.close();
            }
          }, error => {
            this.loading = false;
            Notiflix.Notify.failure('Gagal memperbarui password.',{ timeout: 2000 });
          })
        } else {
          this.loading = false;
        }
      })
    } else {
      Notiflix.Notify.failure('Kata Sandi minimal 6 karakter!',{ timeout: 2000 });
      this.loading = false;
    }
  }

}
