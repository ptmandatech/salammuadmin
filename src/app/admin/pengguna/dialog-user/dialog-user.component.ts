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
  myControlCabang = new FormControl();
  myControlRanting = new FormControl();
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
      cabang: [null],
      ranting: [null],
      role: [null, [Validators.required]],
    });
    this.serverImg = this.common.photoBaseUrl+'users/';
    this.usersData = sourceData.data;
    this.getListCabang();
    this.getListRanting();
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
          cabang: this.usersData.cabang,
          ranting: this.usersData.ranting,
          role: this.usersData.role,
        });

        if(this.usersData.cabang) {
          this.myControlCabang.setValue(this.usersData.cabang);
        }
        if(this.usersData.ranting) {
          this.myControlRanting.setValue(this.usersData.ranting);
        }
      }
    }
    Loading.remove();
  }

  isLoading:boolean = false;
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

  listCabang:any = [];
  listCabangTemp:any = [];
  gettingCabang:boolean = true;
  async getListCabang() {
    this.myControlCabang.valueChanges.subscribe(async res => {
      if(res.length >= 3) {
        try {
          await this.api.get('sicara/getAllPCM?nama='+res).then(res=>{ 
            this.listCabang = res;
            this.gettingCabang = false;
          }, err => {
            this.gettingCabang = false;
          });
        } catch {
    
        }
      }
    })
    this.api.get('sicara/getAllPCM').then(res=>{ 
      this.listCabangTemp = res;
      this.gettingCabang = false;
    }, err => {
      this.gettingCabang = false;
    });
  }

  listRanting:any = [];
  listRantingTemp:any = [];
  gettingRanting:boolean = true;
  async getListRanting() {
    this.myControlRanting.valueChanges.subscribe(async res => {
      if(res.length >= 3) {
        try {
          await this.api.get('sicara/getAllPRM?nama='+res).then(res=>{ 
            this.listRanting = res;
            this.gettingRanting = false;
          }, err => {
            this.gettingRanting = false;
          });
        } catch {
    
        }
      }
    })

    this.api.get('sicara/getAllPRM').then(res=>{ 
      this.listRantingTemp = res;
      this.gettingRanting = false;
    }, err => {
      this.gettingRanting = false;
    });
  }

  getTitleCabang(cabangID: string) {
    if(cabangID) {
      return this.listCabangTemp.find((data:any) => data.id === cabangID).nama;
    }
  }

  getTitleRanting(rantingID: string) {
    if(rantingID) {
      return this.listRantingTemp.find((data:any) => data.id === rantingID).nama;
    }
  }

  selectEvent(val:any) {
    this.form.patchValue({
      cabang: val
    })
  }

  selectEventRanting(val:any) {
    this.form.patchValue({
      ranting: val
    })
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
          this.isLoading = true;
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
              this.isLoading = false;
            }, err => {
              this.isLoading = false;
            })
          } else {
            this.api.put('users/'+this.usersData.id, this.usersData).then(res => {
              if(res) {
                Notiflix.Notify.success('Berhasil memperbarui pengguna.',{ timeout: 2000 });
                this.dialogRef.close();
              }
              this.isLoading = false;
            }, err => {
              this.isLoading = false;
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
