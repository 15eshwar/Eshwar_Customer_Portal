import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  customerID: string = '';
  password: string = '';
  showError: boolean = false;
  loginMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.login();
    this.customerID = '';
    this.password = '';
  }

  login(): void {
    const customerID = this.customerID;
    const password = this.password;

    if (!customerID || !password) {
      return;
    }

    this.authService.login(customerID, password).subscribe({
      next: (res) => {
        this.loginMessage = res.message;
        if (res.status === 'S') {
          this.router.navigate(['/home']);
        } else {
          this.showError = true;
        }
      },
      error: () => {
        this.loginMessage = 'Login failed. Try again.';
      }
    });

    localStorage.setItem('customerID', customerID);
  }

  goWelcome(): void {
    this.router.navigate(['/welcome']);
  }

  goLogin(): void {
    this.router.navigate(['/login']);
  }

  goContact(): void {
    this.router.navigate(['/contact']);
  }

  goBack(): void {
    this.router.navigate(['/welcome']);
  }
}
