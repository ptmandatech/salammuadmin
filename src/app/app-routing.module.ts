import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LupaPasswordComponent } from './auth/lupa-password/lupa-password.component';
import { ResetComponent } from './auth/reset/reset.component';

const routes: Routes = [
  {
		path:'auth',
		children:[
			{
				path:'login',
				component:LoginComponent
			},
      {
				path:'lupa-password',
				component:LupaPasswordComponent
			},
      {
				path:'reset/:token',
				component:ResetComponent
			},
		]
	},
  {
    path:'admin',
    loadChildren: () => import('./admin/admin.module').then(mod=>mod.AdminModule)
  },
  {
    path:'',
    pathMatch:'full',
    redirectTo:'/auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
