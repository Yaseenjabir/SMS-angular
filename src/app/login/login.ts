import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '@spartan-ng/helm/sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmToasterComponent],
  templateUrl: './login.html',
  styles: [],
})
export class Login {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  public isChecked = false;

  postData(data: any) {
    const url = `${environment.apiUrl}/auth/login`;
    return this.http.post(url, data, {
      withCredentials: true,
    });
  }
  async onSubmit() {
    if (this.loginForm.valid) {
      const sanitizedEmail = this.sanitizer.sanitize(
        1,
        this.loginForm.value.email
      );
      const sanitizedPassword = this.sanitizer.sanitize(
        1,
        this.loginForm.value.password
      );
      this.postData({
        email: sanitizedEmail,
        password: sanitizedPassword,
      }).subscribe(
        (response: any) => {
          this.router.navigate(['/dashboard']);
          toast(response.message);
        },
        (error) => {
          if (error.status === 401) {
            toast('Invalid Credentials');
          } else {
            toast('Unknown error occurred');
          }
        }
      );
      // Optionally, reset the form
      this.loginForm.reset();
    }
  }
}
