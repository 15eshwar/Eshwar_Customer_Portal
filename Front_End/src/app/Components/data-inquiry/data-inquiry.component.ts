import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InquiryService, Inquiry } from '../../../services/inquiry.service';

@Component({
  selector: 'app-data-inquiry',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './data-inquiry.component.html',
  styleUrl: './data-inquiry.component.css'
})
export class DataInquiryComponent implements OnInit{

isLoading: boolean = true;
noData: boolean = false;
  
inquiries: Inquiry[] = [];

constructor(private inquiryService: InquiryService, private router: Router) {}

  ngOnInit(): void {
     const customerID = localStorage.getItem('customerID');
    console.log(customerID)
if (customerID) {
  this.inquiryService.getInquiries(customerID).subscribe({
  next: (data) => {
    this.inquiries = data.inquiries;
    this.noData = this.inquiries.length === 0;
    this.isLoading = false;
    console.log('API response:', data);  
  },
    error: (error) => {
      console.error('Error fetching inquiries:', error);
      this.isLoading = false;
      this.noData = true;
    }
  });

 }else{
   alert('No customer ID found. Redirecting to login.');
      this.router.navigate(['/login']);
 } 
  }
  goBack() {
    this.router.navigate(['/intelligence']);
  }
}

