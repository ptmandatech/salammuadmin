import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  constructor(
    public api: ApiService,
    public routes: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    var token=this.routes.snapshot.paramMap.get('token');
    this.checkToken(token);
  }

  userData:any;
  checkToken(token:any)
  {    
    this.api.get('auth/reset?token='+token).then(res=>{
      this.userData=res;
    },err=>{
      this.router.navigate(['auth/login']);
    })
  }
  
  showPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  user:any={p1:'',p2:''};
  reset() {
    if(this.user.p1 != '' && this.user.p1 == this.user.p2)
    {
      if(this.user.p1.length >= 6)
      {
        this.api.put('auth/reset',{password:this.user.p1, email:this.userData.email}).then((res:any)=>{
          Notiflix.Notify.success('Pembaruan Kata Sandi berhasil.',{ timeout: 2000 });
          localStorage.removeItem('salammuToken');
          this.router.navigate(['auth/login']);
        },err=>{
          Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
        });
      } else {
        Notiflix.Notify.failure('Kata Sandi minimal 6 karakter!',{ timeout: 2000 });
      }
    } else {
      Notiflix.Notify.failure('Kata Sandi tidak cocok!',{ timeout: 2000 });
    }
  }

}
