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
import {NgxPaginationModule} from 'ngx-pagination';
import { FilterPengajianComponent } from './pengajian/filter-pengajian/filter-pengajian.component';
import { FilterProdukComponent } from './produkmu/filter-produk/filter-produk.component';
import { FilterPenggunaComponent } from './pengguna/filter-pengguna/filter-pengguna.component';
import { UstadzComponent } from './ustadz/ustadz.component';
import { KhutbahComponent } from './khutbah/khutbah.component';
import { KeilmuanUstadzComponent } from './keilmuan-ustadz/keilmuan-ustadz.component';
import { DialogKeilmuanUstadzComponent } from './keilmuan-ustadz/dialog-keilmuan-ustadz/dialog-keilmuan-ustadz.component';
import { DialogKhutbahComponent } from './khutbah/dialog-khutbah/dialog-khutbah.component';
import { DialogUstadzComponent } from './ustadz/dialog-ustadz/dialog-ustadz.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RadiomuComponent } from './radiomu/radiomu.component';
import { DialogRadioComponent } from './radiomu/dialog-radio/dialog-radio.component';
import { SicaraComponent } from './sicara/sicara.component';
import { DaerahComponent } from './sicara/daerah/daerah.component';
import { CabangComponent } from './sicara/cabang/cabang.component';
import { RantingComponent } from './sicara/ranting/ranting.component';
import { DialogCabangComponent } from './sicara/cabang/dialog-cabang/dialog-cabang.component';
import { DialogRantingComponent } from './sicara/ranting/dialog-ranting/dialog-ranting.component';
import { TanyaUstadComponent } from './tanya-ustad/tanya-ustad.component';
import { DialogChatsComponent } from './tanya-ustad/dialog-chats/dialog-chats.component';
import { SyncSicaraComponent } from './sicara/sync-sicara/sync-sicara.component';
import { NotulenmuComponent } from './notulenmu/notulenmu.component';
import { DialogNotulenmuComponent } from './notulenmu/dialog-notulenmu/dialog-notulenmu.component';
import { DetailNotulenmuComponent } from './notulenmu/detail-notulenmu/detail-notulenmu.component';
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
      },
      {
        path: 'ustadz',
        component: UstadzComponent,
        data:{title:'UstadzMU'}
      },
      {
        path: 'tanya-ustadz',
        component: TanyaUstadComponent,
        data:{title:'Tanya UstadzMU'}
      },
      {
        path: 'khutbah',
        component: KhutbahComponent,
        data:{title:'Khutbah'}
      },
      {
        path: 'keilmuan-ustadz',
        component: KeilmuanUstadzComponent,
        data: {title: 'Keilmuan Ustadz'}
      },
      {
        path: 'radiomu',
        component: RadiomuComponent,
        data: {title: 'Radiomu'}
      },
      {
        path: 'sicara',
        component: SicaraComponent,
        data: {title: 'Sicara'}
      },
      {
        path: 'sicara/daerah/:id',
        component: DaerahComponent,
        data: {title: 'Daerah'}
      },
      {
        path: 'sicara/cabang/:id',
        component: CabangComponent,
        data: {title: 'Cabang'}
      },
      {
        path: 'sicara/ranting/:id',
        component: RantingComponent,
        data: {title: 'Ranting'}
      },
      {
        path: 'notulenmu',
        component: NotulenmuComponent,
        data: {title: 'NotulenMU'}
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
    FilterPengajianComponent,
    FilterProdukComponent,
    FilterPenggunaComponent,
    UstadzComponent,
    KhutbahComponent,
    KeilmuanUstadzComponent,
    DialogKeilmuanUstadzComponent,
    DialogKhutbahComponent,
    DialogUstadzComponent,
    RadiomuComponent,
    DialogRadioComponent,
    SicaraComponent,
    DaerahComponent,
    CabangComponent,
    RantingComponent,
    DialogCabangComponent,
    DialogRantingComponent,
    TanyaUstadComponent,
    DialogChatsComponent,
    SyncSicaraComponent,
    NotulenmuComponent,
    DialogNotulenmuComponent,
    DetailNotulenmuComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule.forChild(routes),
    QuillModule.forRoot(),
    RouterModule,
    MatTimepickerModule,
    NgxPaginationModule,
    Ng2SearchPipeModule
  ],
  entryComponents: [
    DashboardComponent,
    DialogBannerComponent
  ],
})
export class AdminModule { }
