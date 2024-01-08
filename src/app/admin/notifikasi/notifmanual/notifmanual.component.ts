import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as Notiflix from 'notiflix';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-notifmanual',
  templateUrl: './notifmanual.component.html',
  styleUrls: ['./notifmanual.component.scss']
})
export class NotifmanualComponent implements OnInit {

  dataPesan:any = {};
  constructor(
    public common: CommonService,
    public http:HttpClient, 
    public dialogRef: MatDialogRef<NotifmanualComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
  }

  ngOnInit(): void {
  }

  kirim() {
    Notiflix.Loading.hourglass();
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    let url = 'https://api.salammu.id/index.php/fcm/notifDinamis?messages=';

    this.http.get(url+this.dataPesan.pesan, httpOption).subscribe((res:any) => {
      Notiflix.Loading.remove();
      Notiflix.Notify.success('Berhasil mengirim notifikasi.',{ timeout: 2000 });
      this.dialogRef.close();
    })
  }

}
