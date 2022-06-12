import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  showPassword: boolean = false;
  localUser:any;
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      remember: [false]
    });
    this.localUser = localStorage.getItem('userSalammu');
    if(this.localUser != null) {
      this.localUser = JSON.parse(this.localUser);
      this.form.patchValue({
        email: this.localUser.email,
        password: this.localUser.password,
        remember: this.localUser.remember,
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  success!:boolean;
  invalid:boolean = false;
  login() {
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);
    }
    else {
      if (this.form.get('remember')?.value) {
        localStorage.setItem('userSalammu', JSON.stringify(this.form.value));
      }
      this.api.post('auth/login',this.form.value).then(res=>{   
        localStorage.setItem('salammuToken',JSON.stringify(res));
        // this.success=true;
        Notiflix.Notify.success('Login sukses. Tunggu sampai diarahkan ke halaman Dashboard.',{ timeout: 2000 });
        this.redirect(res);
      },err=>{
        // var that = this;
        if(err.error.status == 'invalid') {
          // this.invalid = true;
          Notiflix.Notify.failure('Tidak dapat login. Pastikan email dan password benar.',{ timeout: 2000 });
        } else if(err.error.status == 'not_match') {
          // this.invalid = true;
          Notiflix.Notify.failure('Tidak dapat login. Pastikan email dan password benar.',{ timeout: 2000 });
        }
        // setTimeout(function () {
        //   that.invalid = false;
        // }, 1000);
      })

    }
  }

  nonaktif:boolean = false;
  redirect(user:any)
  {
    if(user.is_active == 1) {
      var that = this;
      setTimeout(function () {
        that.router.navigate(['admin/dashboard'], {replaceUrl:true});
      }, 1000);
    } else {
      // this.nonaktif = true;
      Notiflix.Notify.info('Status pengguna nonaktif. Silahkan hubungi admin Salammu.',{ timeout: 2000 });
      // setTimeout(function () {
      //   location.reload();
      // }, 1000);
    }
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
