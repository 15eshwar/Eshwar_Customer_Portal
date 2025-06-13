import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OsdService , OverallSalesData } from '../../../services/osd.service';
@Component({
  selector: 'app-osd',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './osd.component.html',
  styleUrls: ['./osd.component.css']
})
export class OsdComponent implements OnInit{

isLoading: boolean = true;
noData: boolean = false;

records: OverallSalesData[] = [];

constructor(private osdService :OsdService, private router: Router){}

ngOnInit(): void {
     const customerID = localStorage.getItem('customerID');
    console.log(customerID)
if (customerID) {
  this.osdService.getOsd(customerID).subscribe({
  next: (data) => {
    this.records = (data?.records ?? []).filter(item => item != null);
    this.noData = this.records.length === 0;
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
    this.router.navigate(['/finance-sheet']);
  }

}
