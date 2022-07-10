import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';
import Quill from 'quill';
import { HttpClient } from '@angular/common/http';

Quill.register('modules/imageHandler', ImageHandler);
Quill.register('modules/videoHandler', VideoHandler);

@Component({
  selector: 'app-dialog-ustadz',
  templateUrl: './dialog-ustadz.component.html',
  styleUrls: ['./dialog-ustadz.component.scss']
})
export class DialogUstadzComponent implements OnInit {

  ustadzmuData: any = {};
  isCreated:boolean;
  constructor(
    public common: CommonService,
    public dialogRef: MatDialogRef<DialogUstadzComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.ustadzmuData = sourceData.data;
    if(this.ustadzmuData == null) {
      this.ustadzmuData = {};
      this.isCreated = true;
      this.ustadzmuData.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
    } else {
      this.isCreated = false;
      this.prov.setValue(this.ustadzmuData.prov_id);
      this.kab.setValue(this.ustadzmuData.kab_id);
      this.kec.setValue(this.ustadzmuData.kec_id);
    }
    Loading.remove();
  }

  prov = new FormControl('', [Validators.required]);
  kab = new FormControl('', [Validators.required]);
  kec = new FormControl('', [Validators.required]);
  filteredOptionsProv: Observable<any[]>;
  filteredOptionsKab: Observable<any[]>;
  filteredOptionsKec: Observable<any[]>;

  async ngOnInit(): Promise<void> {
    await this.getProvinsi();
    this.cekLogin();
    this.kab.disable();
    this.kec.disable();
  }

  userData:any;
  cekLogin()
  {    
    this.api.me().then(async res=>{
      this.userData = res;
      await this.getAllScience();
    });
  }

  allSciences:any=[];
  getAllScience() {
    this.api.get('sciences').then(res=>{
      this.allSciences=res;
    })
  }

  allProvinsi:any=[];
  getProvinsi()
  {
    this.api.get('alamat/provinsi').then(res=>{
      this.allProvinsi=res;
      if(!this.isCreated) {
        this.kab.enable();
        this.prov.setValue(this.ustadzmuData.prov_id);
        this.getKab();
      }
      this.filteredOptionsProv = this.prov.valueChanges.pipe(
        startWith(''),
        map(value => this._filterProv(value || '')),
      );
    })
  }

  allKab:any=[];
  getKab()
  {
    this.api.get('alamat/kabupaten?prov_id='+this.prov.value).then(res=>{
      this.allKab=res;
      if(!this.isCreated) {
        this.kec.enable();
        this.kab.setValue(this.ustadzmuData.kab_id);
        this.getKec();
      }
      this.filteredOptionsKab = this.kab.valueChanges.pipe(
        startWith(''),
        map(value => this._filterKab(value || '')),
      );
    })
  }

  allKec:any=[];
  getKec()
  {
    this.api.get('alamat/kecamatan?kab_id='+this.kab.value).then(res=>{
      this.allKec=res;
      if(!this.isCreated) {
        this.kec.setValue(this.ustadzmuData.kec_id);
      }
      this.filteredOptionsKec = this.kec.valueChanges.pipe(
        startWith(''),
        map(value => this._filterKec(value || '')),
      );
    })
  }

  onChangeProv(value:any) {
    this.kab.enable();
    this.getKab();
  }

  getTitle(prov_id: string) {
    if(prov_id) {
      let dt = this.allProvinsi.find((prov: any) => prov.prov_id === prov_id);
      if(dt)
      return dt.prov_nama;
    }
  }

  onChangeKab(value:any) {
    this.kec.enable();
    this.getKec();
  }

  getTitleKab(kab_id: string) {
    if(kab_id) {
      let dt = this.allKab.find((prov: any) => prov.kab_id === kab_id);
      if(dt)
      return dt.kab_nama;
    }
  }

  getTitleKec(kec_id: string) {
    if(kec_id) {
      let dt = this.allKec.find((kec: any) => kec.kec_id === kec_id);
      if(dt)
      return dt.kec_nama;
    }
  }

  private _filterProv(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allProvinsi.filter((prov: any) => prov.prov_nama.toLowerCase().includes(filterValue));
  }

  private _filterKab(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allKab.filter((kab: any) => kab.kab_nama.toLowerCase().includes(filterValue));
  }

  private _filterKec(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allKec.filter((kec: any) => kec.kec_nama.toLowerCase().includes(filterValue));
  }

  save() {
    this.ustadzmuData.prov_id = this.prov.value;
    this.ustadzmuData.kab_id = this.kab.value;
    this.ustadzmuData.kec_id = this.kec.value;
    if(this.isCreated == true) {
      this.ustadzmuData.created_by = this.userData.id;
      this.api.post('ustadzmu', this.ustadzmuData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil menambahkan data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    } else {
      this.api.put('ustadzmu/'+this.ustadzmuData.id, this.ustadzmuData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil memperbarui data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    }
  }

}
