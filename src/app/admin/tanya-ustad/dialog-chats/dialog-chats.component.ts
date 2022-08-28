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
import { HttpClient } from '@angular/common/http';
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
  constructor(
    public common: CommonService,
    public dialogRef: MatDialogRef<DialogChatsComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.roomData = sourceData.data;
    this.checkRoom();
    this.getChats();
  }

  async ngOnInit(): Promise<void> {
    this.cekLogin();
  }

  userData:any = {};
  cekLogin()
  {    
    this.api.me().then(async res=>{
      this.userData = res;
    });
  }

  checkRoom() {
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

  
  message: any;
  pressEnter(event:any)
  {
    if(this.message.length == 0) return;
    if(event.key == 'Enter') {
      this.message = event.target.value;
      if(this.message.length == 0) {
        return;
      } else {
        this.sendMessage();
      }
    }
  }

  sendMessage() {
    let dt = {
      id: new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))],
      created_by: this.userData.id,
      room_id: this.roomData.id,
      messages: this.message,
      ustad_already_read: this.roomData.ustadz_id == this.userData.id ? true:false,
      user_already_read: this.roomData.ustadz_id != this.userData.id ? true:false,
      type: this.image == null ? 'text':'image'
    }

    this.message = null;

    this.api.post('chattings/chats', dt).then(res => {
      // console.log(res)
      this.getChats();
    });
  }

  image:any;

}
