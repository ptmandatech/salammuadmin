import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';

@Component({
  selector: 'app-lupa-password',
  templateUrl: './lupa-password.component.html',
  styleUrls: ['./lupa-password.component.scss']
})
export class LupaPasswordComponent implements OnInit {

  form!: FormGroup;
  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  reset() {
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);
    }
    else {
      this.api.post('auth/reset',{email:this.form.get('email')?.value}).then((res:any)=>{
        Notiflix.Notify.success('Tautan pembaharuan password berhasil dikirim.',{ timeout: 2000 });
        localStorage.removeItem('salammuToken');
        this.form.reset();
      },err=>{
        Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
      });
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
