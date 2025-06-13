import { Component, OnInit } from '@angular/core';
import { ProfileService, CustomerProfile } from '../../../services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  customer: CustomerProfile = {
    customerID: '',
    customerName: '',
    street: '',
    city: '',
    postalCode: '',
    country: ''
  };

  constructor(private profileService: ProfileService, private router: Router) {}

  ngOnInit(): void {
    const customerID = localStorage.getItem('customerID');
    console.log(customerID)

    if (customerID) {
      this.profileService.getProfile(customerID).subscribe({
        next: (data) => {
          this.customer = data;
          console.log(this.customer)
        },
        error: (err) => {
          console.error('Profile fetch failed:', err);
        }
      });
    } else {
      alert('No customer ID found. Redirecting to login.');
      this.router.navigate(['/login']);
    }
  }
    goBack() {
    this.router.navigate(['/home']);
  }
}
