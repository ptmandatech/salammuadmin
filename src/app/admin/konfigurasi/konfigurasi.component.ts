import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { DialogKonfigurasiComponent } from './dialog-konfigurasi/dialog-konfigurasi.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-konfigurasi',
  templateUrl: './konfigurasi.component.html',
  styleUrls: ['./konfigurasi.component.scss']
})
export class KonfigurasiComponent implements OnInit {

  p: number = 1;
  constructor(
    public api: ApiService,
    private router: Router,
    public common: CommonService,
    public routes: ActivatedRoute,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
  ) { }

  serverImg:any;
  pageTitle:any;
  loading:boolean = false;
  formSMTP!: FormGroup;
  ngOnInit(): void {
    this.loading = true;
    // Loading.pulse();
    this.formSMTP = this.formBuilder.group({
      id: [null, [Validators.required]],
      email_from: [null, [Validators.required]],
      email_address: [null, [Validators.required, Validators.email]],
      smtp_host: [null, [Validators.required]],
      smtp_username: [null, [Validators.required]],
      smtp_password: [null, [Validators.required]],
      smtp_port: [465, [Validators.required]],
      smtp_ssltls: ['ssl', [Validators.required]]
    });

    this.serverImg = this.common.photoBaseUrl+'categories/';
    this.pageTitle = this.routes.snapshot.firstChild?.data.title;
    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.pageTitle = this.routes.snapshot.firstChild?.data.title;
      }
    });
    this.cekLogin();
    this.getSmtpConfig();
    this.getConfig();
  }

  ssltls:any = [
    {
      id: 'ssl',
      name: 'SSL'
    },
    {
      id: 'tls',
      name: 'TLS'
    }
  ]

  userData:any;
  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
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

  allConfig:any = [];
  getConfig() {
    this.allConfig = [];
    this.api.get('config').then(res=>{
      this.allConfig = res;
      this.loading = false;
      this.allConfig.forEach((n:any) => {
        if(n.value == '1' || n.value == '0') {
          n.isActive = n.value == '1' ? true:false;
        }
      });
      // Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      this.loading = false;
      // Loading.remove();
    });
  }

  dataSmtp:any = {};
  getSmtpConfig() {
    this.api.get('config/smtp').then(res=>{
      this.dataSmtp = res;
      this.loading = false;
      if(res) {
        this.formSMTP.patchValue({
          id: this.dataSmtp.id,
          email_from: this.dataSmtp.email_from,
          email_address: this.dataSmtp.email_address,
          smtp_host: this.dataSmtp.smtp_host,
          smtp_username: this.dataSmtp.smtp_username,
          smtp_password: this.dataSmtp.smtp_password,
          smtp_port: this.dataSmtp.smtp_port,
          smtp_ssltls: this.dataSmtp.smtp_ssltls,
        });
      }
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      this.loading = false;
    });
  }

  saveSMTP() {
    let data = this.formSMTP.value;
    this.api.put('config/smtp/'+data.id, data).then(res => {
      if(res) {
        Notiflix.Notify.success('Berhasil memperbarui data SMTP.',{ timeout: 2000 });
        this.getSmtpConfig();
      }
    })
  }

  //Dialog tambah/edit Cabang Ranting
  openDialog(n:any): void {
    const dialogRef = this.dialog.open(DialogKonfigurasiComponent, {
      width: '650px',
      disableClose: true,
      data: {data:n}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getConfig();
    });
  }

  changeStatus(n:any) {
    if(n.isActive) {
      n.value = '1';
    } else {
      n.value = '0';
    }
    this.api.put('config/'+n.key, n).then(res => {
      if(res) {
        Notiflix.Notify.success('Berhasil memperbarui data.',{ timeout: 2000 });
        this.getConfig();
      }
    })
  }

  delete(n:any) {
    Swal.fire({
      title: 'Anda Yakin ingin menghapus data ?',
      text: "Data yang telah terhapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.delete('config/'+n.id).then(res => {
          if(res) {
            Notiflix.Notify.success('Berhasil menghapus data.',{ timeout: 2000 });
            this.getConfig();
          }
        })
      } else {
        Notiflix.Notify.failure('Aksi dibatalkan.',{ timeout: 2000 });
      }
    })
  }

}
