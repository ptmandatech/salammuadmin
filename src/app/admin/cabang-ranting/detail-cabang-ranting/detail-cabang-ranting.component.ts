import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-cabang-ranting',
  templateUrl: './detail-cabang-ranting.component.html',
  styleUrls: ['./detail-cabang-ranting.component.scss']
})
export class DetailCabangRantingComponent implements OnInit {

  crData: any = {};
  isCreated:boolean;
  constructor(
    public common: CommonService,
    public dialogRef: MatDialogRef<DetailCabangRantingComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.crData = sourceData.data;
    console.log(this.crData)
    if(this.crData == null) {
      this.crData = {};
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

  getInnerHTML(val:any){
    if(val) {
      return val.replace(/(<([^>]+)>)/ig,'');
    }
  }

  verifikasi() {
    Swal.fire({
      title: 'Anda yakin ingin melanjutkan verifikasi data cabang/ranting?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, Verifikasi!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.crData.verified = true;
        this.api.put('cr/'+ this.crData.id, this.crData).then(res => {
          if(res) {
            Notiflix.Notify.success('Data Berhasil di Verifikasi.',{ timeout: 2000 });
            this.dialogRef.close();
          }
        }).catch(error => {
          Notiflix.Notify.success('Data Gagal di Verifikasi.',{ timeout: 2000 });
        })
      }
    })
  }

  batalVerif() {
    Swal.fire({
      title: 'Anda yakin ingin melanjutkan membatalkan verifikasi data cabang/ranting?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, Batalkan!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.crData.verified = false;
        this.api.put('cr/'+ this.crData.id, this.crData).then(res => {
          if(res) {
            Notiflix.Notify.success('Verifikasi Berhasil dibatalkan.',{ timeout: 2000 });
            this.dialogRef.close();
          }
        }).catch(error => {
          Notiflix.Notify.success('Verifikasi Gagal dibatalkan.',{ timeout: 2000 });
        })
      }
    })
  }

}
