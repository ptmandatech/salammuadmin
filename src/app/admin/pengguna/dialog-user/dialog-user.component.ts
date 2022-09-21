import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
  form!: FormGroup;
  constructor(
    public common: CommonService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogUserComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.form = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],
      address: [null, [Validators.required]],
      role: [null, [Validators.required]],
    });
    this.serverImg = this.common.photoBaseUrl+'users/';
    this.usersData = sourceData.data;
    if(this.usersData == null) {
      this.usersData = {};
      this.isCreated = true;
      this.id = new Date().getTime().toString();
    } else {
      this.isCreated = false;
      this.id = this.usersData.id;
      if(this.usersData != null) {
        this.form.patchValue({
          id: this.usersData.id,
          name: this.usersData.name,
          email: this.usersData.email,
          phone: this.usersData.phone,
          address: this.usersData.address,
          role: this.usersData.role,
        });
      }
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
      this.getAllRoles();
    });
  }

  allRoles:any = [];
  getAllRoles() {
    this.api.get('roles?all').then(res=>{
      this.allRoles = res;
      this.allRoles.forEach((e:any, index:any) => {
        e.path = JSON.parse(e.path);
      });
      this.allRoles = this.allRoles.sort((a:any,b:any) => a.name < b.name ? -1:1);
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
    });
  }

  save() {
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);
    }
    else {
      Swal.fire({
        title: 'Anda yakin ingin menyimpan data pengguna?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2196F3',
        cancelButtonColor: '#F44336',
        confirmButtonText: 'Ya, Simpan!',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          this.usersData = this.form.value;
          if(this.isCreated == true) {
            this.usersData.is_active = 1;
            this.usersData.date_created = new Date();
            this.usersData.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
            this.usersData.password = this.usersData.phone;
            this.api.post('auth/register/', this.usersData).then((res:any) => {
              if(res != 'email_invalid') {
                Notiflix.Notify.success('Berhasil menambahkan pengguna.',{ timeout: 2000 });
                this.dialogRef.close();
              } else {
                Notiflix.Notify.failure('Email salah atau sudah terdaftar.',{ timeout: 2000 });
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

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

}
