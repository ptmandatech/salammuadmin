import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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
import { DetailPesertaComponent } from '../detail-peserta/detail-peserta.component';

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
    public dialog: MatDialog,
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

  peserta(): void {
    const dialogRef = this.dialog.open(DetailPesertaComponent, {
      width: '650px',
      data: {
        data: this.dataNotulen,
        action: 'view'
      },
      disableClose: true,
    });
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
