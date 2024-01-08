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
  selector: 'app-dialog-notulenmu',
  templateUrl: './dialog-notulenmu.component.html',
  styleUrls: ['./dialog-notulenmu.component.scss']
})
export class DialogNotulenmuComponent implements OnInit {

  penyelenggara =[
    'Cabang',
    'Ranting',
    'Lainnya'
  ]

  dataNotulen: any = {};
  dataLogin: any = {};
  isCreated:boolean;
  dateValue:any;
  timeValue:any;
  serverImg:any;
  today:any;
  form!: FormGroup;
  get f() { return this.form.controls; }
  minDate = new Date();
  imageNow:any = [];
  myControlCabang = new FormControl();
  myControlRanting = new FormControl();
  constructor(
    public http:HttpClient,
    public common: CommonService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogNotulenmuComponent>,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.serverImg = this.common.photoBaseUrl+'notulenmu/';
    this.dataLogin = JSON.parse(localStorage.getItem('salammuToken'));
    this.getListCabang();
    this.getListRanting();
    this.form = this.formBuilder.group({
      id: [null],
      title: [null, [Validators.required]],
      place: [null, [Validators.required]],
      notulen: [null, [Validators.required]],
      organization_type: [null, [Validators.required]],
      organization_id: [null, [Validators.required]],
      created_by: [null],
    });
    if(sourceData.data == null) {
      this.dataNotulen = {};
      this.isCreated = true;
      this.dataNotulen.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
      this.dataNotulen.notulenmu_participants = [];
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

        if(this.dataNotulen.organization_type == 'cabang') {
          this.myControlCabang.setValue(this.dataNotulen.organization_id);
        } else {
          this.myControlRanting.setValue(this.dataNotulen.organization_id);
        }

        if(this.dataLogin.role != 'superadmin') {
          if(this.dataNotulen.organization_type == 'cabang') {
            this.selectedCR = this.dataLogin.cabang_id;
            this.selectCR();
          }

          if(this.dataNotulen.organization_type == 'ranting') {
            this.selectedCR = this.dataLogin.ranting_id;
            this.selectCR();
          }
        }
      }
    }
    Loading.remove();
  }

  isLoading:boolean = false;
  ngOnInit(): void {
    this.today = new Date();
    this.cekLogin();
  }

  userData:any;
  cekLogin()
  {    
    if(this.dataLogin.cabang_nama) {
      let dt = {
        id: this.dataLogin.cabang_id,
        nama: this.dataLogin.cabang_nama,
        type: 'cabang'
      }
      this.pilihanCR.push(dt);
    }
    if(this.dataLogin.ranting_nama) {
      let dt = {
        id: this.dataLogin.ranting_id,
        nama: this.dataLogin.ranting_nama,
        type: 'ranting'
      }
      this.pilihanCR.push(dt);
    }

    this.api.me().then(res=>{
      this.userData = res;
      if(this.isCreated) {
        this.dataNotulen.created_by = this.userData.id;
      }
    });
  }

  pilihanCR:any = [];
  selectedCR = '';
  selectCR() {
    let idx = this.pilihanCR.findIndex((e:any) => e.id === this.selectedCR);
    if(idx != -1) {
      let data = this.pilihanCR[idx];
      if(data.type == 'cabang') {
        this.dataNotulen.organization_id = data.id;
        this.dataNotulen.organization_type = 'cabang';
        this.form.patchValue({
          organization_id: data.id,
          organization_type: 'cabang'
        })
      } else {
        this.dataNotulen.organization_id = data.id;
        this.dataNotulen.organization_type = 'ranting';
        this.form.patchValue({
          organization_id: data.id,
          organization_type: 'ranting'
        })
      }
    }
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
            this.gettingCabang = false;
          }, err => {
            this.gettingCabang = false;
          });
        } catch {
    
        }
      }
    })
    this.api.get('sicara/getAllPCM').then(res=>{ 
      this.listCabangTemp = res;
    }, err => {
    });
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
            this.gettingRanting = false;
          }, err => {
            this.gettingRanting = false;
          });
        } catch {
    
        }
      }
    })

    this.api.get('sicara/getAllPRM').then(res=>{ 
      this.listRantingTemp = res;
    }, err => {
    });
  }

  selectEvent(val:any) {
    this.form.patchValue({
      organization_id: val
    })
  }

  getTitleCabang(cabangID: string) {
    if(cabangID) {
      return this.listCabangTemp.find((data:any) => data.id === cabangID).nama;
    }
  }

  getTitleRanting(rantingID: string) {
    if(rantingID) {
      return this.listRantingTemp.find((data:any) => data.id === rantingID).nama;
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
      this.isLoading = true;
      this.dataNotulen.title = this.form.get('title').value;
      this.dataNotulen.place = this.form.get('place').value;
      this.dataNotulen.notulen = this.form.get('notulen').value;
      this.dataNotulen.organization_type = this.form.get('organization_type').value;
      this.dataNotulen.organization_id = this.form.get('organization_id').value;
      this.dataNotulen.notulen = this.form.get('notulen').value;

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

      delete this.dataNotulen.notulenmu_participants;

      if(this.dateValue != undefined) {
        if(hours > 24) {
          Notiflix.Notify.failure('Pastikan format 24 jam!',{ timeout: 2000 });
          this.isLoading = false;
        } else {
          this.dataNotulen.datetime = this.dateValue.setHours(hours, minutes);
          this.dataNotulen.datetime = new Date(this.dataNotulen.datetime);

          if(this.isCreated == true) {
            this.api.post('notulenmu', this.dataNotulen).then(res => {
              if(res) {
                Notiflix.Notify.success('Berhasil menambahkan data.',{ timeout: 2000 });
                this.dialogRef.close();
              }
              this.isLoading = false;
            }, err => {
              this.isLoading = false;
            })
          } else {
            this.api.put('notulenmu/'+this.dataNotulen.id, this.dataNotulen).then(res => {
              if(res) {
                Notiflix.Notify.success('Berhasil memperbarui data.',{ timeout: 2000 });
                this.dialogRef.close();
              }
              this.isLoading = false;
            }, err => {
              this.isLoading = false;
            })
          }
        }
      } else {
        Notiflix.Notify.failure('Tentukan tanggal!',{ timeout: 2000 });
        this.isLoading = false;
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
          this.isLoading = false;
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

  showFormTambahPeserta:boolean = false;
  namaPeserta = '';
  tambahPeserta() {
    this.showFormTambahPeserta == true ? this.showFormTambahPeserta = false:this.showFormTambahPeserta = true;
  }

  batalTambahPeserta() {
    this.showFormTambahPeserta = false;
    this.namaPeserta = '';
  }

  simpanPeserta() {
    let dt = {
      id: new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))],
      user_id: 'm_'+new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))],
      user_name: this.namaPeserta,
      notulenmu_id: this.dataNotulen.id,
      created_by: this.dataNotulen.created_by,
    }
    this.dataNotulen.notulenmu_participants.push(dt);
    
    this.api.post('notulenmu/participants', this.dataNotulen.notulenmu_participants).then(res => {
      if(res) {
        Notiflix.Notify.success('Berhasil menambahkan data peserta.',{ timeout: 2000 });
      }
    });

    this.showFormTambahPeserta = false;
    this.namaPeserta = '';
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

  //Dialog tambah/edit peserta
  peserta(): void {
    const dialogRef = this.dialog.open(DetailPesertaComponent, {
      width: '650px',
      data: {
        data: this.dataNotulen,
        action: this.isCreated ? 'add':'update'
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dataNotulen.notulenmu_participants = result;
      }
    });
  }


}
