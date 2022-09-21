import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';

@Component({
  selector: 'app-dialog-radio',
  templateUrl: './dialog-radio.component.html',
  styleUrls: ['./dialog-radio.component.scss']
})
export class DialogRadioComponent implements OnInit {

  radiomuData: any = {};
  isCreated:boolean;
  serverImg:any;
  constructor(
    public common: CommonService,
    public dialogRef: MatDialogRef<DialogRadioComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.serverImg = this.common.photoBaseUrl+'radiomu/';
    this.radiomuData = sourceData.data;
    if(this.radiomuData == null) {
      this.radiomuData = {};
      this.isCreated = true;
      this.radiomuData.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
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
        if (e.total <= 2000000) {
          let image = new Image();
          image.src = e.target.result;
          image.onload = (rs) => {
            this.image = e.target.result;
          };
        } else {
          this.fileInput.nativeElement.value = '';
          Notiflix.Notify.failure('Ukuran tidak boleh lebih dari 2 MB',{ timeout: 2000 });
        }
      };
      reader.readAsDataURL(imgFile.target.files[0]);
      // Reset if duplicate image uploaded again
      this.fileInput.nativeElement.value = '';
    } else {
      this.fileAttr = 'Belum ada file yang dipilih';
    }
  }

  urlRegEx = "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?";
  progressUpload:boolean;
  async uploadPhoto()
  {
    if(this.isValidUrl(this.radiomuData.url)) { 
      if(this.image != undefined) {
        this.progressUpload = true;
        await this.api.put('radiomu/uploadfoto',{image: this.image}).then(res=>{
          this.radiomuData.image = res;
          this.progressUpload = false;
          if(res) {
            this.save();
          }
        }, error => {
          console.log(error)
        });
      } else {
        this.save();
      }
    } else {
      Notiflix.Notify.failure('Masukkan url dengan format yang benar, contoh https://example.com',{ timeout: 2000 });
    }
  }

  save() {
    if(this.isCreated == true) {
      this.radiomuData.created_by = this.userData.id;
      this.api.post('radiomu', this.radiomuData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil menambahkan data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    } else {
      this.api.put('radiomu/'+this.radiomuData.id, this.radiomuData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil memperbarui data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    }
  }

  isValidUrl(urlString: string): boolean {
    try {
      let pattern = new RegExp(this.urlRegEx);
      let valid = pattern.test(urlString);
      return valid;
    } catch (TypeError) {
      return false;
    }
  }


}
