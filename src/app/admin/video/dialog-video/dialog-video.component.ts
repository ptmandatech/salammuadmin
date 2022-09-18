import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dialog-video',
  templateUrl: './dialog-video.component.html',
  styleUrls: ['./dialog-video.component.scss']
})
export class DialogVideoComponent implements OnInit {

  videosData: any = {};
  isCreated:boolean;
  serverImg:any;
  constructor(
    public common: CommonService,
    public dialogRef: MatDialogRef<DialogVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.serverImg = this.common.photoBaseUrl+'videos/';
    this.videosData = sourceData.data;
    if(this.videosData == null) {
      this.videosData = {};
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

  async uploadPhoto()
  {
    if(this.image != undefined) {
      await this.api.put('videos/uploadfoto',{image: this.image}).then(res=>{
        this.videosData.image = res;
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
      this.videosData.url = 'https://www.youtube.com/embed/'+this.videosData.url;
      this.videosData.created_by = this.userData.id;
      this.videosData.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
      this.api.post('videos', this.videosData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil menambahkan data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    } else {
      let check = this.videosData.url.includes('https://www.youtube.com/embed/');
      if(!check) {
        this.videosData.url = 'https://www.youtube.com/embed/'+this.videosData.url;
      }
      this.api.put('videos/'+this.videosData.id, this.videosData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil memperbarui data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    }
  }

}
