import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-produkmu',
  templateUrl: './dialog-produkmu.component.html',
  styleUrls: ['./dialog-produkmu.component.scss']
})
export class DialogProdukmuComponent implements OnInit {

  productsData: any = {};
  isCreated:boolean;
  serverImg:any;
  id:any;
  imageNow:any = [];
  constructor(
    public common: CommonService,
    public dialogRef: MatDialogRef<DialogProdukmuComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.serverImg = this.common.photoBaseUrl+'products/';
    this.productsData = sourceData.data;
    console.log(this.productsData)
    if(this.productsData == null) {
      this.productsData = {};
      this.isCreated = true;
      this.id = new Date().getTime().toString();
      this.productsData.images = [];
    } else {
      this.isCreated = false;
      this.id = this.productsData.id;
      if(this.productsData.images != '') {
        this.imageNow = this.productsData.images;
      }
    }
    Loading.remove();
  }

  ngOnInit(): void {
    this.getCategories();
    this.cekLogin();
  }

  userData:any;
  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
    });
  }

  allCategories:any = [];
  getCategories() {
    this.api.get('categories').then(res=>{
      this.allCategories = res;
      console.log(res)
      Loading.remove();
    }, err => {
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      Loading.remove();
    });
  }

  @ViewChild('fileInput')
  fileInput!: ElementRef;
  fileAttr = 'Belum ada file yang dipilih';
  images:any = [];
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
          this.images.push(e.target.result);
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);
      // Reset if duplicate image uploaded again
      this.fileInput.nativeElement.value = '';
    } else {
      this.fileAttr = 'Belum ada file yang dipilih';
    }
  }

  imgUploaded:any = [];
  async uploadPhoto()
  {
    if(this.images.length > 0) {
      for(var i=0; i<this.images.length; i++) {
        await this.api.put('products/uploadfoto/'+this.id,{image: this.images[i]}).then(res=>{
          this.imgUploaded.push(res);
          console.log(this.imgUploaded)
          if(i+1 == this.images.length) {
            this.save();
          }
        }, error => {
          console.log(error)
        });
      }
    } else {
      this.save();
    }
  }

  removeImages(idx:any) {
    Swal.fire({
      title: 'Anda yakin ingin menghapus gambar produk?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, hapus!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productsData.images.splice(idx, 1);
        Notiflix.Notify.success('Gambar Berhasil dihapus.',{ timeout: 2000 });
      } else {
        Notiflix.Notify.info('Aksi Berhasil Dibatalkan.',{ timeout: 2000 });
      }
    })
  }

  removeImagesLokal(idx:any) {
    Swal.fire({
      title: 'Anda yakin ingin menghapus gambar produk?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, hapus!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.images.splice(idx, 1);
        Notiflix.Notify.success('Gambar Berhasil dihapus.',{ timeout: 2000 });
      } else {
        Notiflix.Notify.info('Aksi Berhasil Dibatalkan.',{ timeout: 2000 });
      }
    })
  }

  save() {
    this.productsData.images = JSON.stringify(this.imgUploaded);
    if(this.images.length > 0) {
      this.imgUploaded = this.imgUploaded.concat(this.imageNow);
      this.productsData.images = '';
      this.productsData.images = JSON.stringify(this.imgUploaded);
    } else {
      this.productsData.images = '';
      this.productsData.images = JSON.stringify(this.imageNow);
    }
    if(this.isCreated == true) {
      this.productsData.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
      this.productsData.created_by = this.userData.id;
      this.api.post('products', this.productsData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil menambahkan data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    } else {
      this.api.put('products/'+this.productsData.id, this.productsData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil memperbarui data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    }
  }

}
