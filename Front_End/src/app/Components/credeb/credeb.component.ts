import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { CommonModule} from '@angular/common';
import { CredebService,CDdata } from '../../../services/credeb.service';


@Component({
  selector: 'app-credeb',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './credeb.component.html',
  styleUrl: './credeb.component.css'
})
export class CredebComponent implements OnInit {

isLoading: boolean = true;
noData: boolean = false;

creditMemos: CDdata[] =[];

constructor(private credebService: CredebService, private router: Router) {}

ngOnInit(): void {
  const customerID = localStorage.getItem('customerID');
  console.log('Customer ID:', customerID);
  if (customerID) {
  this.credebService.getCreditdebits(customerID).subscribe({
  next: (data) => {
    console.log('API raw response:', data);
      this.creditMemos = data.creditMemos
      this.noData = this.creditMemos.length === 0;
      this.isLoading = false;
    },
  error: (error) => {
    console.error('Error fetching sales orders:', error);
     this.isLoading = false;
      this.noData = true;
  }

});

} else {
    alert('No customer ID found. Redirecting to login.');
    this.router.navigate(['/login']);
  }
}

goBack() {
    this.router.navigate(['/finance-sheet']);
  }

}


