import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dialog-cabang-ranting',
  templateUrl: './dialog-cabang-ranting.component.html',
  styleUrls: ['./dialog-cabang-ranting.component.scss']
})
export class DialogCabangRantingComponent implements OnInit {

  crData: any = {};
  isCreated:boolean;
  constructor(
    public common: CommonService,
    public dialogRef: MatDialogRef<DialogCabangRantingComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.crData = sourceData.data;
    console.log(this.crData)
    if(this.crData == null) {
      this.crData = {};
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

  getInnerHTML(val:any){
    if(val) {
      return val.replace(/(<([^>]+)>)/ig,'');
    }
  }

  save() {
    if(this.isCreated == true) {
      this.crData.verified = false;
      this.crData.created_by = this.userData.id;
      this.api.post('cr', this.crData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil menambahkan data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    } else {
      this.api.put('cr/'+this.crData.id, this.crData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil memperbarui data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    }
  }
  

}
