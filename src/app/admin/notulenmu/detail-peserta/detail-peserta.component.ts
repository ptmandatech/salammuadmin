import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import { DatePipe } from '@angular/common';
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';
import Quill from 'quill';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatSelectionListChange } from '@angular/material/list';

Quill.register('modules/imageHandler', ImageHandler);
Quill.register('modules/videoHandler', VideoHandler);

@Component({
  selector: 'app-detail-peserta',
  templateUrl: './detail-peserta.component.html',
  styleUrls: ['./detail-peserta.component.scss']
})
export class DetailPesertaComponent implements OnInit {

  dataNotulen: any = {};
  listUsers:any = [];
  listUsersTemp:any = [];
  serverImg: any;
  dataLogin:any = {};
  loading:boolean;
  userForm = this.formBuilder.group({
    selectedUsers: ''
  });
  action:any;

  constructor(
    public http:HttpClient,
    public common: CommonService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DetailPesertaComponent>,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.dataLogin = JSON.parse(localStorage.getItem('salammuToken'));
    this.serverImg = this.common.photoBaseUrl+'users/';
    this.dataNotulen = sourceData.data;
    this.action = sourceData.action;
    this.getAllUsers();
    if(this.action == 'view') {
      this.userForm.disable();
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

  getAllUsers() {
    if(this.dataLogin) {
      if(this.dataLogin.role == 'superadmin') {
        this.api.get('users/getAllAdmin').then(res => {
          this.listUsers = res;
          this.listUsersTemp = res;
          this.parseData();
        }, error => {
          this.loading = false;
        })
      } else {
        this.api.get('users/getAll?cabang='+this.dataLogin.cabang_id+'&ranting='+this.dataLogin.ranting_id).then(res => {
          this.listUsers = res;
          this.listUsersTemp = res;
          this.parseData();
        }, error => {
          this.loading = false;
        })
      }
    }
  }
  
  parseData() {
    if(this.dataNotulen.notulenmu_participants.length > 0) {
      for(var i=0; i<this.dataNotulen.notulenmu_participants.length; i++) {
        let p = this.dataNotulen.notulenmu_participants[i];
        this.dataNotulen.notulenmu_participants[i].checked = true;
        for(var j=0; j<this.listUsers.length; j++) {
          let u = this.listUsers[j];
          if(p.user_id == u.id) {
            this.listUsers[j].checked = true;
          }
        }
        let idx = this.listUsers.findIndex((v:any) => v.id == p.user_id);
        if(idx == -1) {
          p.checked = true;
          p.name = p.user_name;
          this.listUsers.push(p);
        }
      }
    }
  }

  searchText = '';

  initializeItems(): void {
    this.listUsers = this.listUsersTemp;
    this.dataNotulen.notulenmu_participants = this.dataNotulen.notulenmu_participantsTemp;
  }

  searchTerm: string = '';
  searchChanged(evt:any) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listUsers = this.listUsers.filter((data:any) => {
      if (data.name && searchTerm) {
        if (data.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      } else {
        return false;
      }
    });

    this.dataNotulen.notulenmu_participants = this.dataNotulen.notulenmu_participants.filter((data:any) => {
      if (data.user_name && searchTerm) {
        if (data.user_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      } else {
        return false;
      }
    });
  }

  simpanPeserta() {
    let data = this.userForm.get('selectedUsers').value;
    let result:any = [];
    for(var i = 0; i < data.length; i++) {
      let dt = {
        id: new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))],
        user_id: data[i].id,
        user_name: data[i].name,
        user_image: data[i].image,
        user_email: data[i].email,
        notulenmu_id: this.dataNotulen.id,
      }
      result.push(dt);
    }
    
    this.api.post('notulenmu/participants', result).then(res => {
      if(res) {
        Notiflix.Notify.success('Berhasil menambahkan data peserta.',{ timeout: 2000 });
        this.dialogRef.close(result);
      }
    }, err => {
      this.loading = false;
    })
  }

}
