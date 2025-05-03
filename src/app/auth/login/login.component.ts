// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/authService/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule 
  ]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService 
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login({ email, password }).subscribe({
        next: (res) => {
          console.log('Login success:', res);
          
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
          
          const helper = new JwtHelperService();
          const decoded = helper.decodeToken(res.accessToken); 
          console.log('Decoded Token:', decoded);
          
          if (res.expiryDate) {
            localStorage.setItem('expiryDate', res.expiryDate);
          } else if (decoded.exp) {
            const expiryDate = new Date(decoded.exp * 1000).toISOString();
            localStorage.setItem('expiryDate', expiryDate);
            console.log('Calculated expiry date:', expiryDate);
          } else {
            const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000).toISOString();
            localStorage.setItem('expiryDate', oneHourFromNow);
            console.log('Default expiry date set:', oneHourFromNow);
          }
  
          const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          if (role === 'SuperAdmin') {
            this.router.navigate(['/dashboard/superadmin']);
          } else if (role === 'Admin') {
            this.router.navigate(['/dashboard/admin']);
          } else {
            this.router.navigate(['/dashboard/user']);
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Login failed. Please check your email and password.');
        }
      });
    } else {
      console.log('Form is not valid:', this.loginForm.value);
      alert('Formda xatolik bor. Iltimos, email va parolni to\'g\'ri kiriting.');
    }
  }
}