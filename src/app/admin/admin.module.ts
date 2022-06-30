import { AngularMaterialModule } from './../angular-material/angular-material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTimepickerModule } from 'mat-timepicker';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BannerComponent } from './banner/banner.component';
import { PengajianComponent } from './pengajian/pengajian.component';
import { CabangRantingComponent } from './cabang-ranting/cabang-ranting.component';
import { VideoComponent } from './video/video.component';
import { DoaDzikirComponent } from './doa-dzikir/doa-dzikir.component';
import { ArtikelmuComponent } from './artikelmu/artikelmu.component';
import { DialogBannerComponent } from './banner/dialog-banner/dialog-banner.component';
import { DialogPengajianComponent } from './pengajian/dialog-pengajian/dialog-pengajian.component';
import { DetailPengajianComponent } from './pengajian/detail-pengajian/detail-pengajian.component';
import { DialogCabangRantingComponent } from './cabang-ranting/dialog-cabang-ranting/dialog-cabang-ranting.component';
import { DetailCabangRantingComponent } from './cabang-ranting/detail-cabang-ranting/detail-cabang-ranting.component';
import { DialogVideoComponent } from './video/dialog-video/dialog-video.component';
import { DialogDoaDzikirComponent } from './doa-dzikir/dialog-doa-dzikir/dialog-doa-dzikir.component';
import { DialogArtikelmuComponent } from './artikelmu/dialog-artikelmu/dialog-artikelmu.component';
import { PediamuComponent } from './pediamu/pediamu.component';
import { ProdukmuComponent } from './produkmu/produkmu.component';
import { DialogPediamuComponent } from './pediamu/dialog-pediamu/dialog-pediamu.component';
import { KategoriProdukComponent } from './kategori-produk/kategori-produk.component';
import { PenggunaComponent } from './pengguna/pengguna.component';
import { RolePermissionComponent } from './role-permission/role-permission.component';
import { DialogKategoriProdukComponent } from './kategori-produk/dialog-kategori-produk/dialog-kategori-produk.component';
import { DialogRolePermissionComponent } from './role-permission/dialog-role-permission/dialog-role-permission.component';
import { DialogUserComponent } from './pengguna/dialog-user/dialog-user.component';
import { DialogSettingRoleComponent } from './pengguna/dialog-setting-role/dialog-setting-role.component';
import { DialogUpdatePasswordComponent } from './pengguna/dialog-update-password/dialog-update-password.component';
import { DialogProdukmuComponent } from './produkmu/dialog-produkmu/dialog-produkmu.component';
import { QuillModule } from 'ngx-quill';
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data:{title:'Dashboard'}
      },
      {
        path: 'banner',
        component: BannerComponent,
        data:{title:'Banner'}
      },
      {
        path: 'pengajian',
        component: PengajianComponent,
        data:{title:'Pengajian'}
      },
      {
        path: 'cabang-ranting',
        component: CabangRantingComponent,
        data:{title:'Cabang Ranting'}
      },
      {
        path: 'video',
        component: VideoComponent,
        data:{title:'Video'}
      },
      {
        path: 'doa-dzikir',
        component: DoaDzikirComponent,
        data:{title:'Doa & Dzikir'}
      },
      {
        path: 'artikelmu',
        component: ArtikelmuComponent,
        data:{title:'Artikelmu'}
      },
      {
        path: 'pediamu',
        component: PediamuComponent,
        data:{title:'Pediamu'}
      },
      {
        path: 'produkmu',
        component: ProdukmuComponent,
        data:{title:'Produkmu'}
      },
      {
        path: 'kategori-produk',
        component: KategoriProdukComponent,
        data:{title:'Kategori Produk'}
      },
      {
        path: 'pengguna',
        component: PenggunaComponent,
        data:{title:'Pengguna'}
      },
      {
        path: 'role-permission',
        component: RolePermissionComponent,
        data:{title:'Role Permission'}
      }
    ]
  },
  {
    path: '',
    redirectTo: '/admin/dashboard',
    pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    BannerComponent,
    PengajianComponent,
    CabangRantingComponent,
    VideoComponent,
    DoaDzikirComponent,
    ArtikelmuComponent,
    DialogBannerComponent,
    DialogPengajianComponent,
    DetailPengajianComponent,
    DialogCabangRantingComponent,
    DetailCabangRantingComponent,
    DialogVideoComponent,
    DialogDoaDzikirComponent,
    DialogArtikelmuComponent,
    PediamuComponent,
    ProdukmuComponent,
    DialogPediamuComponent,
    KategoriProdukComponent,
    PenggunaComponent,
    RolePermissionComponent,
    DialogKategoriProdukComponent,
    DialogRolePermissionComponent,
    DialogUserComponent,
    DialogSettingRoleComponent,
    DialogUpdatePasswordComponent,
    DialogProdukmuComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule.forChild(routes),
    QuillModule.forRoot(),
    RouterModule,
    MatTimepickerModule
  ],
  entryComponents: [
    DashboardComponent,
    DialogBannerComponent
  ],
})
export class AdminModule { }
