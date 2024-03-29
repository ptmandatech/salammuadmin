import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dialog-banner',
  templateUrl: './dialog-banner.component.html',
  styleUrls: ['./dialog-banner.component.scss']
})
export class DialogBannerComponent implements OnInit {

  bannersData: any = {};
  serverImgBanner:any;
  isCreated:boolean;
  isLoading:boolean = false;
  constructor(
    public common: CommonService,
    public dialogRef: MatDialogRef<DialogBannerComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.bannersData = sourceData.data;
    if(this.bannersData == null) {
      this.bannersData = {};
      this.isCreated = true;
    } else {
      this.isCreated = false;
    }
    Loading.remove();
  }

  ngOnInit(): void {
    this.serverImgBanner = this.common.photoBaseUrl+'banners/';
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
          Notiflix.Notify.failure('Ukuran tidak boleh lebih dari 2 MB',{ timeout: 2000 });
          this.fileInput.nativeElement.value = '';
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
    this.isLoading = true;
    if(this.isValidUrl(this.bannersData.url)) { 
      if(this.image != undefined) {
        this.progressUpload = true;
        await this.api.put('banners/uploadfoto',{image: this.image}).then(res=>{
          this.bannersData.image = res;
          this.progressUpload = false;
          if(res) {
            this.addBanner();
          }
        }, error => {
          this.isLoading = false;
          console.log(error)
        });
      } else {
        this.addBanner();
      }
    } else {
      Notiflix.Notify.failure('Masukkan url dengan format yang benar, contoh https://example.com',{ timeout: 2000 });
      this.isLoading = false;
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

  addBanner() {
    if(this.isCreated == true) {
      this.bannersData.created_by = this.userData.id;
      this.bannersData.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
      this.api.post('banners', this.bannersData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil menambahkan banner.',{ timeout: 2000 });
          this.dialogRef.close();
        }
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
      })
    } else {
      this.api.put('banners/'+ this.bannersData.id, this.bannersData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil memperbarui banner.',{ timeout: 2000 });
          this.dialogRef.close();
        }
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
      })
    }
  }

}
