import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LupaPasswordComponent } from './auth/lupa-password/lupa-password.component';

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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
