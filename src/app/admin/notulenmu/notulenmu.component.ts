import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { DialogNotulenmuComponent } from './dialog-notulenmu/dialog-notulenmu.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DetailNotulenmuComponent } from './detail-notulenmu/detail-notulenmu.component';
import { DatePipe } from '@angular/common';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var htmlToPdfmake = require("html-to-pdfmake");

@Component({
  selector: 'app-notulenmu',
  templateUrl: './notulenmu.component.html',
  styleUrls: ['./notulenmu.component.scss']
})
export class NotulenmuComponent implements OnInit {

  myControlCabang = new FormControl();
  myControlRanting = new FormControl();

  p: number = 1;
  constructor(
    public api: ApiService,
    private router: Router,
    public common: CommonService,
    public routes: ActivatedRoute,
    public dialog: MatDialog,
    public datePipe: DatePipe,
  ) { 
  }

  dataLogin:any = {};
  serverImg:any;
  pageTitle:any;
  loading:boolean = false;
  ngOnInit(): void {
    this.loading = true;
    // Loading.pulse();
    this.dataLogin = JSON.parse(localStorage.getItem('salammuToken'));
    this.serverImg = this.common.photoBaseUrl+'notulenmu/';
    this.pageTitle = this.routes.snapshot.firstChild?.data.title;
    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.pageTitle = this.routes.snapshot.firstChild?.data.title;
      }
    });
    this.cekLogin();
    this.getListCabang();
    this.getListRanting();
  }

  listCabang:any = [];
  listCabangTemp:any = [];
  gettingCabang:boolean = true;
  async getListCabang() {
    this.myControlCabang.valueChanges.subscribe(async res => {
      if(res.length >= 3) {
        try {
          await this.api.get('sicara/getAllPCM?nama='+res).then(res=>{ 
            this.listCabang = res;
            this.listCabangTemp = res;
            this.gettingCabang = false;
          }, err => {
            this.loading = false;
            this.gettingCabang = false;
          });
        } catch {
    
        }
      } else {
        this.searchText = '';
        this.onSearch();
      }
    })
  }

  listRanting:any = [];
  listRantingTemp:any = [];
  gettingRanting:boolean = true;
  async getListRanting() {
    this.myControlRanting.valueChanges.subscribe(async res => {
      if(res.length >= 3) {
        try {
          await this.api.get('sicara/getAllPRM?nama='+res).then(res=>{ 
            this.listRanting = res;
            this.listRantingTemp = res;
            this.gettingRanting = false;
          }, err => {
            this.loading = false;
            this.gettingRanting = false;
          });
        } catch {
    
        }
      } else {
        this.searchText = '';
        this.onSearch();
      }
    })
  }

  selectOption(value:any) {
    this.searchText = value;
    this.onSearch();
  }

  searchText = '';
  onSearch() {
    this.p = 1;
  }

  userData:any;
  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
      this.getAllNotulenmu();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      localStorage.removeItem('salammuToken');
      this.router.navigate(['/auth/login'], {replaceUrl:true});
    })
  }

  allNotulenmu:any = [];
  getAllNotulenmu() {
    this.allNotulenmu = [];
    if(this.dataLogin) {
      if(this.dataLogin.role == 'superadmin') {
        this.api.get('notulenmu').then(res=>{
          this.allNotulenmu = res;
          this.loading = false;
          // Loading.remove();
        }, err => {
          Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
          this.loading = false;
          // Loading.remove();
        });
      } else {
        this.api.get('notulenmu?cabang='+this.userData.cabang+'&ranting='+this.userData.ranting).then(res => {
          this.allNotulenmu = res;
          this.loading = false;
        }, error => {
          this.loading = false;
        })
      }
    }
  }

  //Dialog tambah/edit Cabang Ranting
  openDialog(n:any): void {
    const dialogRef = this.dialog.open(DialogNotulenmuComponent, {
      width: '650px',
      disableClose: true,
      data: {data:n}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.allData.checked = false;
      this.hasSelectedData = false;

      this.getAllNotulenmu();
    });
  }

  openDetail(data:any): void {
    const dialogRef = this.dialog.open(DetailNotulenmuComponent, {
      width: '650px',
      disableClose: true,
      data: {data:data}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.allData.checked = false;
      this.hasSelectedData = false
      this.getAllNotulenmu();
    });
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
        n.isDeleted = 1;
        this.api.put('notulenmu/'+n.id, n).then(res => {
          if(res) {
            Notiflix.Notify.success('Berhasil menghapus data.',{ timeout: 2000 });
            this.allData.checked = false;
            this.hasSelectedData = false;
            this.getAllNotulenmu();
          }
        })
      } else {
        this.allData.checked = false;
        this.hasSelectedData = false;
        Notiflix.Notify.failure('Aksi dibatalkan.',{ timeout: 2000 });
      }
    })
  }

  hasSelectedData:boolean = false;
  selectAll(evt:any, n:any) {
    if(n == 'all') {
      if(evt.target.checked) {
        this.allNotulenmu.forEach((e:any) => {
          e.checked = true;
        });
      } else {
        this.allNotulenmu.forEach((e:any) => {
          e.checked = false;
        });
      }
    } else {
      if(evt.target.checked) {
        this.allNotulenmu[n].checked = true;
      } else {
        this.allNotulenmu[n].checked = false;
      }
    }
    let checkData = this.allNotulenmu.filter((e:any) => e.checked == true);
    checkData.length > 0 ? this.hasSelectedData = true : this.hasSelectedData = false;
  }

  allData:any = {};
  hapusDataTerpilih() {
    let checkData = this.allNotulenmu.filter((e:any) => e.checked == true);
    if(checkData.length > 0) {
      Swal.fire({
        title: 'Anda yakin ingin menghapus persetujuan data ArtikelMU?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2196F3',
        cancelButtonColor: '#F44336',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          // Loading.pulse();
          checkData.forEach((e:any, idx:any) => {
            e.isDeleted = 1;
            this.api.put('notulenmu/'+e.id, e).then(res => {
              if(res) {
                if(idx+1 == checkData.length) {
                  this.getAllNotulenmu();
                  Notiflix.Notify.success('Verifikasi Berhasil dibatalkan.',{ timeout: 2000 });
                  this.allNotulenmu.forEach((e:any) => {
                    e.checked = false;
                  });
                  this.allData.checked = false;
                  this.hasSelectedData = false;
                }
              }
              this.loading = false;
            })
          });
        } else {
          Notiflix.Notify.failure('Aksi dibatalkan.',{ timeout: 2000 });
        }
      })
    } else {
      Notiflix.Notify.success('Hapus data terpilih sudah dibatalkan.',{ timeout: 2000 });
    }
  }

  pdfObj:any;
  async export(n:any)
  {
    Loading.pulse();
    let participants = [];
    let lampiran = [];
    for(var i=0; i<n.notulenmu_participants.length; i++) {
      var nama = n.notulenmu_participants[i].user_name;
      var dt = [
        {text: (i+1) + '. ' + nama, fontSize: 12, marginTop: 8, marginBottom: 8}
      ]
      participants.push(dt);
    }
    
    let images = JSON.parse(n.images);
    for(var i=0; i<images.length; i++) {
      var image = this.serverImg+images[i];
      let dt = [
        {
          image: await this.getBase64ImageFromURL(image), 
          fontSize: 12, 
          marginTop: 8, 
          marginBottom: 8,
          alignment:'center'
        }
      ]
      lampiran.push(dt);
    }

    var notulen = htmlToPdfmake(n.notulen);

    const dd = {
      content: [
          {
              text:n.title,
              fontSize:14,
              bold:true,
              alignment:'center'
          },
          {
              text: n.organization_nama,
              fontSize:18,
              bold:true,
              alignment:'center',
          },
          {
              text: this.datePipe.transform(new Date(n.datetime).toString(), 'EEEE, dd MMMM yyyy') + '. Jam '+this.datePipe.transform(new Date(n.datetime).toString(), 'H:mm')+'. Di '+n.place,
              fontSize:12,
              alignment:'center',
              marginBottom:30
          },
          {
            table: {
              headerRows: 1,
              widths: [ '*'],
              body: [
                [
                  {
                    bold: true,
                    colSpan: 1,
                    alignment:'center',
                    fontSize: 12,
                    text: "Peserta yang hadir"
                  }
                ],
                [
                  participants
                ]
              ]
            },
            marginBottom:10
          },
          {
            text:'PEMBAHASAN',
            fontSize:14,
            bold:true,
            alignment:'center',
          },
          [
            notulen
          ],
          {
            text:'LAMPIRAN',
            fontSize:14,
            bold:true,
            alignment:'center',
          },
          [
            lampiran
          ],
          {
              text:'Dicetak melalui SalamMU Mobile pada '+this.datePipe.transform(new Date().toString(), 'dd MMMM yyyy H:mm:ss a')+'.',
              alignment:'center',
              marginTop:30,
              fontSize:10,
              italic:true
          }
      ]
    }
    // pdfMake.createPdf(dd).open();
    this.downloadPDF(dd, n);
  }

  downloadPDF(dd:any, n:any) {
    this.pdfObj = pdfMake.createPdf(dd);
    this.pdfObj.download('notulenmu_'+n.title+'.pdf');
    Loading.remove();
  }

  getBase64ImageFromURL(url:any) {
    const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/' + url;
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        // Mendapatkan ukuran asli gambar
        const originalWidth = img.width;
        const originalHeight = img.height;
      
        // Menetapkan ukuran baru untuk gambar (50%)
        const newWidth = originalWidth / 2;
        const newHeight = originalHeight / 2;
        
        canvas.width = newWidth;
        canvas.height = newHeight;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, originalWidth, originalHeight, 0, 0, newWidth, newHeight);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = corsAnywhereUrl;
    });
  }

}
