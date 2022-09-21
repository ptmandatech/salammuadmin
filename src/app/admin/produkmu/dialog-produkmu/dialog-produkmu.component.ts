import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';
import Swal from 'sweetalert2';
import Quill from 'quill';
import { HttpClient } from '@angular/common/http';

Quill.register('modules/imageHandler', ImageHandler);
Quill.register('modules/videoHandler', VideoHandler);

@Component({
  selector: 'app-dialog-produkmu',
  templateUrl: './dialog-produkmu.component.html',
  styleUrls: ['./dialog-produkmu.component.scss']
})
export class DialogProdukmuComponent implements OnInit {

  productsData: any = {};
  isCreated:boolean;
  serverImg:any;
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
    if(this.productsData == null) {
      this.productsData = {};
      this.isCreated = true;
      this.productsData.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
      this.productsData.images = [];
    } else {
      this.isCreated = false;
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
      this.allCategories = this.allCategories.sort((a:any,b:any) => a.name < b.name ? -1:1)
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
        if (e.total <= 2000000) {
          let image = new Image();
          image.src = e.target.result;
          image.onload = (rs) => {
            this.images.push(e.target.result);
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

  byPassedHTMLString:any;
  modules = {
    toolbar: [
      ['image', 'video']
    ],
    imageHandler: {
      upload: (file) => {
        return new Promise(async (resolve, reject) => {
          if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') { // File types supported for image
            if (file.size < 1000000) { // Customize file size as per requirement
            
            // Sample API Call
              let input = new FormData();
              input.append('file', file);
              // let image;
              // this.base64.encodeFile(file)
              //         .then((base64File: string) => {
              //   image = base64File;
              //   console.log(image)
              // }, (err) => {
              //   alert('err '+ err);
              // });
              return this.api.postCrImg('products/quilluploadfoto/'+this.productsData.id, input)
                .then(result => {
                  resolve(this.common.serverImgPath+result); // RETURN IMAGE URL from response
                })
                .catch(error => {
                  reject('Upload failed'); 
                  // Handle error control
                  console.error('Error:', error);
                });
            } else {
              reject('Size too large');
            // Handle Image size large logic 
            }
          } else {
            reject('Unsupported type');
          // Handle Unsupported type logic
          }
        });
      },
      accepts: ['png', 'jpg', 'jpeg', 'jfif'] // Extensions to allow for images (Optional) | Default - ['jpg', 'jpeg', 'png']
    } as Options
  }

  imgUploaded:any = [];
  progressUpload:boolean;
  async uploadPhoto()
  {
    if(this.images.length > 0) {
      this.progressUpload = true;
      for(var i=0; i<this.images.length; i++) {
        await this.api.put('products/uploadfoto/'+this.productsData.id,{image: this.images[i]}).then(res=>{
          this.imgUploaded.push(res);
          if(i+1 == this.images.length) {
            this.progressUpload = false;
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
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
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
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
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
      this.productsData.created_by = this.userData.id;
      this.productsData.verified = false
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
