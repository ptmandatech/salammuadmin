import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dialog-kategori-produk',
  templateUrl: './dialog-kategori-produk.component.html',
  styleUrls: ['./dialog-kategori-produk.component.scss']
})
export class DialogKategoriProdukComponent implements OnInit {

  categoriesData: any = {};
  isCreated:boolean;
  serverImg:any;
  constructor(
    public common: CommonService,
    public dialogRef: MatDialogRef<DialogKategoriProdukComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.serverImg = this.common.photoBaseUrl+'categories/';
    this.categoriesData = sourceData.data;
    if(this.categoriesData == null) {
      this.categoriesData = {};
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
      this.categoriesData.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
      this.categoriesData.created_by = this.userData.id;
      this.api.post('categories', this.categoriesData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil menambahkan data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    } else {
      this.api.put('categories/'+this.categoriesData.id, this.categoriesData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil memperbarui data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    }
  }

}
