import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';
import Quill from 'quill';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ScrollToBottomDirective } from 'src/app/scroll-to-bottom.directive';

Quill.register('modules/imageHandler', ImageHandler);
Quill.register('modules/videoHandler', VideoHandler);

@Component({
  selector: 'app-dialog-chats',
  templateUrl: './dialog-chats.component.html',
  styleUrls: ['./dialog-chats.component.scss']
})
export class DialogChatsComponent implements OnInit {

  roomData: any = {};
  isCreated:boolean;
  listChats:any = [];
  @ViewChild(ScrollToBottomDirective)
  scroll: ScrollToBottomDirective;
  serverImg: any;
  constructor(
    public common: CommonService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<DialogChatsComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.serverImg = this.common.photoBaseUrl+'chattings/';
    this.roomData = sourceData.data;
  }

  async ngOnInit(): Promise<void> {
    this.cekLogin();
  }

  userData:any = {};
  cekLogin()
  {    
    this.api.me().then(async res=>{
      this.userData = res;
      this.checkRoom();
      this.getChats();
    });
  }

  isUstad:boolean = false;
  checkRoom() {
    console.log(this.roomData)
    if(this.roomData.ustadz_id == this.userData.id) {
      this.isUstad = true;
    } else {
      this.isUstad = false;
    }
    console.log(this.isUstad)
    this.api.post('chattings/checkRooms', this.roomData).then(res => {
      // console.log(res)
    })
  }

  getChats() {
    this.api.get('chattings/getChats/'+this.roomData.id).then(res => {
      // console.log(res)
      this.listChats = res;
      Loading.remove();
    }, err => {
      Loading.remove();
    })
  }

  @ViewChild('fileInput')
  fileInput!: ElementRef;
  fileAttr = 'Belum ada file yang dipilih';
  attachFile:boolean = false;
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
  
  message: any;
  pressEnter(event:any)
  {
    if(this.message.length == 0) return;
    if(event.key == 'Enter') {
      this.message = event.target.value;
      if(this.message.length == 0) {
        return;
      } else {
        this.uploadPhoto();
      }
    }
  }

  imagePath:any;
  image:any;
  async uploadPhoto()
  {
    if(this.message.length == 0) {
      return;
    } else {
      let id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
      if(this.image) {
        await this.api.put('chattings/uploadfoto/'+id,{image: this.image}).then(res=>{
          this.imagePath = res;
          console.log(res)
          this.sendMessage(id);
        }, error => {
          console.log(error)
        });
      } else {
        this.sendMessage(id);
      }
    }
  }

  sendMessage(id:any) {
    let dt = {
      id: id,
      created_by: this.userData.id,
      room_id: this.roomData.id,
      messages: this.message,
      image: this.image == null ? null:this.imagePath,
      ustad_already_read: this.roomData.ustadz_id == this.userData.id ? true:false,
      user_already_read: this.roomData.ustadz_id != this.userData.id ? true:false,
      type: this.image == null ? 'text':'image'
    }

    this.api.post('chattings/chats', dt).then(res => {
      // console.log(res)
      this.sendNotif();
      this.getChats();

      this.message = null;
      this.image = null;
      this.attachFile = false;
    });
  }

  //notifikasi
  url_notif = 'https://fcm.googleapis.com/fcm/send';

  sendNotif() {
    let data = {
      "notification" : {
        "title": "SalamMU - " + this.isUstad ? this.roomData.ustadz_name:this.roomData.user_name,
        "body":this.message,
        "sound":"default",
        "icon":"logo"
      },
      "data": {
        "ustadz_id": this.roomData.ustadz_id,
        "ustadz_name": this.roomData.ustadz_name,
        "user_id": this.roomData.user_id,
        "room_id":this.roomData.id,
      },
      "to": this.isUstad ? this.roomData.tokenUser : this.roomData.tokenUstad,
      "priority":"high",
      "restricted_package_name":""
    };

    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `key=AAAAfUgqfM0:APA91bE2AsdIjPXxbQmvzOqkXfcNoREowKF__oE4P8GJUEcXPYuZb78cMd_S7Os5fnXPskvY6RHDuJs4Af5G-gkSAw0uOZHXnt_BYfczS_zPuDy6k9DomFfI1TWuv-OILopIrqxznJXv`
    });

    this.http.post(this.url_notif, data, { headers }).subscribe( res => {
    });
  }

}
