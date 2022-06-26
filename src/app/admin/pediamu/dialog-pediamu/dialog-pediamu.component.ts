import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dialog-pediamu',
  templateUrl: './dialog-pediamu.component.html',
  styleUrls: ['./dialog-pediamu.component.scss']
})
export class DialogPediamuComponent implements OnInit {

  pediamuData: any = {};
  isCreated:boolean;
  serverImg:any;
  constructor(
    public common: CommonService,
    public dialogRef: MatDialogRef<DialogPediamuComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.serverImg = this.common.photoBaseUrl+'pediamu/';
    this.pediamuData = sourceData.data;
    console.log(this.pediamuData)
    if(this.pediamuData == null) {
      this.pediamuData = {};
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

  @ViewChild('fileInput')
  fileInput!: ElementRef;
  fileAttr = 'Belum ada file yang dipilih';
  image:any;
  uploadFileEvt(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileAttr = '';
      Array.from(imgFile.target.files).forEach((file: any) => {
        this.fileAttr += file.name + ' - ';
      });
      // HTML5 FileReader API
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = (rs) => {
          this.image = e.target.result;
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);
      // Reset if duplicate image uploaded again
      this.fileInput.nativeElement.value = '';
    } else {
      this.fileAttr = 'Belum ada file yang dipilih';
    }
  }

  async uploadPhoto()
  {
    if(this.image != undefined) {
      await this.api.put('pediamu/uploadfoto',{image: this.image}).then(res=>{
        this.pediamuData.image = res;
        if(res) {
          this.save();
        }
      }, error => {
        console.log(error)
      });
    } else {
      this.save();
    }
  }

  save() {
    if(this.isCreated == true) {
      this.pediamuData.created_by = this.userData.id;
      this.api.post('pediamu', this.pediamuData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil menambahkan data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    } else {
      this.api.put('pediamu/'+this.pediamuData.id, this.pediamuData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil memperbarui data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    }
  }

}
