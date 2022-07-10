import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dialog-keilmuan-ustadz',
  templateUrl: './dialog-keilmuan-ustadz.component.html',
  styleUrls: ['./dialog-keilmuan-ustadz.component.scss']
})
export class DialogKeilmuanUstadzComponent implements OnInit {

  sciencesData: any = {};
  isCreated:boolean;
  constructor(
    public common: CommonService,
    public dialogRef: MatDialogRef<DialogKeilmuanUstadzComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.sciencesData = sourceData.data;
    if(this.sciencesData == null) {
      this.sciencesData = {};
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
      this.sciencesData.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
      this.sciencesData.created_by = this.userData.id;
      this.api.post('sciences', this.sciencesData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil menambahkan data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    } else {
      this.api.put('sciences/'+this.sciencesData.id, this.sciencesData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil memperbarui data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    }
  }

}
