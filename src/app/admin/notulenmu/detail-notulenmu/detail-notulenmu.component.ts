import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import { DatePipe } from '@angular/common';
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';
import Quill from 'quill';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

Quill.register('modules/imageHandler', ImageHandler);
Quill.register('modules/videoHandler', VideoHandler);

@Component({
  selector: 'app-detail-notulenmu',
  templateUrl: './detail-notulenmu.component.html',
  styleUrls: ['./detail-notulenmu.component.scss']
})
export class DetailNotulenmuComponent implements OnInit {

  penyelenggara =[
    'Cabang',
    'Ranting',
    'Lainnya'
  ]

  dataNotulen: any = {};
  isCreated:boolean;
  dateValue:any;
  timeValue:any;
  serverImg:any;
  today:any;
  @ViewChild('mapElementRef', { static: true }) mapElementRef: ElementRef | undefined;
  form!: FormGroup;
  get f() { return this.form.controls; }
  minDate = new Date();
  imageNow:any = [];
  constructor(
    public http:HttpClient,
    public common: CommonService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DetailNotulenmuComponent>,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.serverImg = this.common.photoBaseUrl+'notulenmu/';
    this.getAllCr();
    this.form = this.formBuilder.group({
      id: [null],
      title: [null, [Validators.required]],
      place: [null, [Validators.required]],
      notulen: [null, [Validators.required]],
      organization_type: [null, [Validators.required]],
      organization_id: [null],
      created_by: [null],
    });
    if(sourceData.data == null) {
      this.dataNotulen = {};
      this.isCreated = true;
    } else {
      this.dataNotulen = sourceData.data;
      this.isCreated = false;
      if(this.dataNotulen.datetime != '0000-00-00 00:00:00.000000') {
        this.dateValue = this.datePipe.transform(new Date(this.dataNotulen.datetime), 'MM/dd/yyyy');
        this.dateValue = new Date(this.dateValue);
        this.timeValue = new Date(this.dataNotulen.datetime);
      }
      if(this.dataNotulen.images != '') {
        this.imageNow = JSON.parse(this.dataNotulen.images);
        this.dataNotulen.images = this.imageNow;
      }
      
      if(this.dataNotulen != null) {
        this.form.patchValue({
          id: this.dataNotulen.id,
          title: this.dataNotulen.title,
          place: this.dataNotulen.place,
          notulen: this.dataNotulen.notulen,
          organization_type: this.dataNotulen.organization_type,
          organization_id: this.dataNotulen.organization_id,
          url_livestream: this.dataNotulen.url_livestream,
          location: this.dataNotulen.location,
          verified: this.dataNotulen.verified,
          created_by: this.dataNotulen.created_by,
        });

        this.form.disable();
      }
    }
    Loading.remove();
  }

  ngOnInit(): void {
    this.today = new Date();
    this.cekLogin();
  }

  userData:any;
  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
    });
  }

  listCabang:any = [];
  listRanting:any = [];
  gettingCabang:boolean = true;
  gettingRanting:boolean = true;
  async getAllCr() {
    // this.api.get('cr').then(res => {
    //   this.parseData(res);
    // })
    try {
      await this.api.get('sicara/getAllPCM').then(res=>{ 
        this.listCabang = res;
        this.listCabang = this.listCabang.sort((a:any,b:any) => a.nama < b.nama ? -1:1)
        this.gettingCabang = false;
      }, err => {
      });
    } catch {

    }
    try {
      await this.api.get('sicara/getAllPRM').then(res=>{
        this.listRanting = res;
        this.listRanting = this.listRanting.sort((a:any,b:any) => a.nama < b.nama ? -1:1)
        this.gettingRanting = false;
      }, err => {
      });
    } catch {

    }
  }

  parseData(res:any) {
    for(var i=0; i<res.length; i++) {
      if(res[i].category == 'cabang') {
        let idx = this.listCabang.indexOf(res[i]);
        if(idx == -1) {
          this.listCabang.push(res[i]);
        }
      } else if(res[i].category == 'ranting') {
        let idx = this.listRanting.indexOf(res[i]);
        if(idx == -1) {
          this.listRanting.push(res[i]);
        }
      }
    }
  }

  save() {
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);
    }
    else {
      this.dataNotulen = this.form.value;
      this.dataNotulen.images = JSON.stringify(this.imgUploaded);
      if(this.images.length > 0) {
        this.imgUploaded = this.imgUploaded.concat(this.imageNow);
        this.dataNotulen.images = '';
        this.dataNotulen.images = JSON.stringify(this.imgUploaded);
      } else {
        this.dataNotulen.images = '';
        this.dataNotulen.images = JSON.stringify(this.imageNow);
      }
      this.timeValue = this.datePipe.transform(new Date(this.timeValue), 'HH:mm');
      let hours = this.timeValue.split(':')[0];
      let minutes = this.timeValue.split(':')[1];
      if(this.dateValue != undefined) {
        if(hours > 24) {
          Notiflix.Notify.failure('Pastikan format 24 jam!',{ timeout: 2000 });
        } else {
          this.dataNotulen.datetime = this.dateValue.setHours(hours, minutes);
          this.dataNotulen.datetime = new Date(this.dataNotulen.datetime);

          if(this.isCreated == true) {
            this.dataNotulen.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
            this.dataNotulen.created_by = this.userData.id;
            this.api.post('notulenmu', this.dataNotulen).then(res => {
              if(res) {
                Notiflix.Notify.success('Berhasil menambahkan data.',{ timeout: 2000 });
                this.dialogRef.close();
              }
            })
          } else {
            this.api.put('notulenmu/'+this.dataNotulen.id, this.dataNotulen).then(res => {
              if(res) {
                Notiflix.Notify.success('Berhasil memperbarui data.',{ timeout: 2000 });
                this.dialogRef.close();
              }
            })
          }
        }
      } else {
        Notiflix.Notify.failure('Tentukan tanggal!',{ timeout: 2000 });
      }
    }
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
      upload: (file:any) => {
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
              return this.api.postCrImg('notulenmu/quilluploadfoto/'+this.dataNotulen.id, input)
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
        await this.api.put('notulenmu/uploadfoto/'+this.dataNotulen.id,{image: this.images[i]}).then(res=>{
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
      title: 'Anda yakin ingin menghapus gambar notulen?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataNotulen.images.splice(idx, 1);
        Notiflix.Notify.success('Gambar Berhasil dihapus.',{ timeout: 2000 });
      } else {
        Notiflix.Notify.info('Aksi Berhasil Dibatalkan.',{ timeout: 2000 });
      }
    })
  }

  removeImagesLokal(idx:any) {
    Swal.fire({
      title: 'Anda yakin ingin menghapus gambar notulen?',
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

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

}
