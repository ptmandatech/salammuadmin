import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-dialog-konfigurasi',
  templateUrl: './dialog-konfigurasi.component.html',
  styleUrls: ['./dialog-konfigurasi.component.scss']
})
export class DialogKonfigurasiComponent implements OnInit {

  dataKonfigurasi: any = {};
  isCreated:boolean;
  constructor(
    public common: CommonService,
    public dialogRef: MatDialogRef<DialogKonfigurasiComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.dataKonfigurasi = sourceData.data;
    if(this.dataKonfigurasi == null) {
      this.dataKonfigurasi = {};
      this.isCreated = true;
    } else {
      this.isCreated = false;
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
    if(this.isCreated == true) {
      this.api.post('config', this.dataKonfigurasi).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil menambahkan data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    } else {
      this.api.put('config/'+this.dataKonfigurasi.key, this.dataKonfigurasi).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil memperbarui data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    }
  }

}
