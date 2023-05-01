import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as Notiflix from 'notiflix';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dialog-notifikasi',
  templateUrl: './dialog-notifikasi.component.html',
  styleUrls: ['./dialog-notifikasi.component.scss']
})
export class DialogNotifikasiComponent implements OnInit {

  dataNotif:any = {};
  cronURL = 'https://api.cron-job.org/';
  constructor(
    public common: CommonService,
    public http:HttpClient, 
    public dialogRef: MatDialogRef<DialogNotifikasiComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    this.getDetailNotif(sourceData.data.jobId);
  }

  ngOnInit(): void {
  }

  getDetailNotif(jobId:any) {
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer Gzd6H8qWSBHN+n4A6/DcI+yf7cQWSW6BDsF5JUGHxok='
      })
    };
    
    this.http.get(this.cronURL+'jobs/'+jobId, httpOption).subscribe((res:any) => {
      console.log(res);
      this.dataNotif = res['jobDetails'];
      console.log(this.dataNotif);
    })
  }

  simpan() {
    
  }

}
