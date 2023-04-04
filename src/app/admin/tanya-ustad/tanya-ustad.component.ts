import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { DialogChatsComponent } from './dialog-chats/dialog-chats.component';

@Component({
  selector: 'app-tanya-ustad',
  templateUrl: './tanya-ustad.component.html',
  styleUrls: ['./tanya-ustad.component.scss']
})
export class TanyaUstadComponent implements OnInit {

  p: number = 1;
  constructor(
    public api: ApiService,
    private router: Router,
    public common: CommonService,
    public routes: ActivatedRoute,
    public dialog: MatDialog,
  ) { }

  serverImg:any;
  pageTitle:any;
  loading:boolean = false;
  ngOnInit(): void {
    this.loading = true;
    // Loading.pulse();
    this.serverImg = this.common.photoBaseUrl+'ustadzmu/';
    this.pageTitle = this.routes.snapshot.firstChild?.data.title;
    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.pageTitle = this.routes.snapshot.firstChild?.data.title;
      }
    });
    this.cekLogin();
  }

  userData:any;
  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
      this.getAvailableRoomChats();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      localStorage.removeItem('salammuToken');
      this.router.navigate(['/auth/login'], {replaceUrl:true});
    })
  }

  searchText = '';
  onSearch() {
    this.p = 1;
  }

  listRoomChats:any = [];
  listRoomChatsTemp:any = [];
  unreadTotal = 0;
  getAvailableRoomChats() {
    this.unreadTotal = 0;
    this.listRoomChats = [];
    this.listRoomChatsTemp = [];
    this.api.get('chattings/getUstadzRooms/'+this.userData.id).then(res => {
      this.listRoomChats = res;
      this.listRoomChatsTemp = res;
      this.listRoomChats.forEach((data:any) => {
        if(data.user_already_read == '0') {
          this.unreadTotal += 1;
        }
      });
      this.loading = false;
      // Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      this.loading = false;
      // Loading.remove();
    });
  }

  //Dialog Tambah/Edit Ustdaz
  openChats(n:any): void {
    const dialogRef = this.dialog.open(DialogChatsComponent, {
      width: '850px',
      data: {data:n}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cekLogin();
    });
  }

}
