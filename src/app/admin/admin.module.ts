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
    DetailPengajianComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule.forChild(routes),
    RouterModule,
    MatTimepickerModule
  ],
  entryComponents: [
    DashboardComponent,
    DialogBannerComponent
  ],
})
export class AdminModule { }
