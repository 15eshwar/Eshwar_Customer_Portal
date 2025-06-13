import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {PayageService , PayAgeItem} from '../../../services/payage.service';

@Component({
  selector: 'app-payage',
  imports: [CommonModule],
  templateUrl: './payage.component.html',
  styleUrl: './payage.component.css'
})
export class PayageComponent implements OnInit{

isLoading: boolean = true;
noData: boolean = false;

  payAgeData: PayAgeItem[]=[];

constructor(private payageService: PayageService,private router: Router) {}

ngOnInit(): void {
const customerID = localStorage.getItem('customerID');
  console.log(customerID);
if (customerID) {
    this.payageService.getPayAgeData(customerID).subscribe({
      next: (data) => {
        console.log('API response:', data);
      this.payAgeData = (data?.payAgeData ?? []).filter(item => item != null);        
            this.noData = this.payAgeData.length === 0;
            this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching deliveries:', error);
        this.payAgeData = [];
        this.isLoading = false;
        this.noData = true;
      }
    });
  } else {
    alert('No customer ID found. Redirecting to login.');
    this.router.navigate(['/login']);
  }
}


goBack(){
   this.router.navigate(['finance-sheet']);
}

}
