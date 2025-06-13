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
export class LoginComponent implements OnInit{
  customerID: string = '';
  password: string = '';
  showError: boolean = false;
  loginMessage = '';

constructor(private router: Router,private authService: AuthService) {}

ngOnInit(): void {
  this.login()
   this.customerID = ''; //to prevent api calls
  this.password = '';
}
login(): void {
  const customerID =this.customerID;
  const password = this.password;
  console.log('Login button clicked');

  // Prevent API call if fields are empty
  if (!this.customerID|| !this.password) {
    console.warn('Vendor ID or Password is missing.');
    return;
  }


  // Replace with your actual login validation logic
this.authService.login(customerID,password).subscribe({
next: (res) => {
console.log('Login response:', res);  // Add this
  this.loginMessage = res.message;
  if (res.status === 'S') {
    console.log('Navigation to /home triggered'),
    this.router.navigate(['/home']);
  } else {
    this.showError = true;
  }
},
error: (err) => {
this.loginMessage = 'Login failed. Try again.';
console.error(err);
},
});
 // Store customerID locally for later use
  localStorage.setItem('customerID', customerID);

}

 goWelcome() {
    this.router.navigate(['/welcome']);
  }
  goLogin() {
    this.router.navigate(['/login']);
  }
  goAbout() {
    this.router.navigate(['/about']);
  }
  goContact() {
    this.router.navigate(['/contact']);
  }
  goBack() {
    this.router.navigate(['/welcome']);
  }
  goSignUp(){
    this.router.navigate(['/sign-up']);
  }
}
