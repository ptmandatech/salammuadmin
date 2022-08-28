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
  selector: 'app-dialog-role-permission',
  templateUrl: './dialog-role-permission.component.html',
  styleUrls: ['./dialog-role-permission.component.scss']
})
export class DialogRolePermissionComponent implements OnInit {

  rolesData: any = {};
  isCreated:boolean;
  menuList = [
    {
      path: '/admin/dashboard',
      checked: false,
      name: 'Dashboard'
    },
    {
      path: '/admin/banner',
      checked: false,
      name: 'Banner'
    }, 
    {
      path: '/admin/pengajian',
      checked: false,
      name: 'Pengajian'
    }, 
    {
      path: '/admin/video',
      checked: false,
      name: 'Video'
    },
    {
      path: '/admin/doa-dzikir',
      checked: false,
      name: 'Doa Dan Dzikir'
    }, 
    {
      path: '/admin/artikelmu',
      checked: false,
      name: 'ArtikelMU'
    }, 
    {
      path: '/admin/pediamu',
      checked: false,
      name: 'PediaMU'
    }, 
    {
      path: '/admin/produkmu',
      checked: false,
      name: 'ProdukMU'
    }, 
    {
      path: '/admin/kategori-produk',
      checked: false,
      name: 'Kategori Produk'
    }, 
    {
      path: '/admin/pengguna',
      checked: false,
      name: 'Pengguna'
    }, 
    {
      path: '/admin/role-permission',
      checked: false,
      name: 'Role Permission'
    },
    {
      path: '/admin/ustadz',
      checked: false,
      name: 'UstadzMU'
    },
    {
      path: '/admin/khutbah',
      checked: false,
      name: 'Khutbah'
    },
    {
      path: '/admin/keilmuan-ustadz',
      checked: false,
      name: 'Keilmuan Ustadz'
    },
    {
      path: '/admin/radiomu',
      checked: false,
      name: 'RadioMu'
    },
    {
      path: '/admin/sicara',
      checked: false,
      name: 'Sicara'
    }
  ];
  constructor(
    public common: CommonService,
    public dialogRef: MatDialogRef<DialogRolePermissionComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.rolesData = sourceData.data;
    if(this.rolesData == null) {
      this.rolesData = {};
      this.isCreated = true;
      this.rolesData.path = [];
      this.menuList.forEach(res => {
        res.checked = false;
      })
      this.rolesData.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
    } else {
      this.isCreated = false;
      this.pathSelected = this.rolesData.path;
      this.menuList = this.arrayWithNoDuplicates([...this.rolesData.path, ...this.menuList], 'path');
    }
    Loading.remove();
  }

  ngOnInit(): void {
    this.cekLogin();
  }

  arrayWithNoDuplicates(array:any, field:any) {
    const arrayWithoutNoDuplicates = array.filter((value:any, index:any, self:any) =>
      index === self.findIndex((t:any) => (
        t[field] === value[field]
      ))
    )
    return arrayWithoutNoDuplicates
  }

  userData:any;
  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
    });
  }

  pathSelected:any = [];
  checkRoles(idx:any) {
    let id = this.pathSelected.indexOf(this.menuList[idx]);
    if(id == -1) {
      this.pathSelected.push(this.menuList[idx]);
    } else {
      this.pathSelected.splice(id, 1);
    }
  }

  save() {
    if(this.isCreated == true) {
      this.rolesData.created_by = this.userData.id;
      this.rolesData.path = JSON.stringify(this.pathSelected);
      this.api.post('roles', this.rolesData).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil menambahkan data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    } else {
      let dt = {
        path: this.pathSelected,
        ...this.rolesData
      }
      dt.path = JSON.stringify(dt.path);
      this.api.put('roles/'+this.rolesData.id, dt).then(res => {
        if(res) {
          Notiflix.Notify.success('Berhasil memperbarui data.',{ timeout: 2000 });
          this.dialogRef.close();
        }
      })
    }
  }

}
