import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SalesOrderService, SalesOrder } from '../../../services/salesOrder.service';

@Component({
  selector: 'app-sales-order',
  standalone:true,
   imports: [CommonModule],
  templateUrl: './sales-order.component.html',
  styleUrl: './sales-order.component.css'
})
export class SalesOrderComponent implements OnInit {

 isLoading: boolean = true;
noData: boolean = false;

SalesOrders : SalesOrder[] = [];

constructor(private salesOrderService: SalesOrderService, private router: Router) {}

 ngOnInit(): void {
  const customerID = localStorage.getItem('customerID');
  console.log('Customer ID:', customerID);

  if (customerID) {
  this.salesOrderService.getSalesOrders(customerID).subscribe({
  next: (data) => {
    console.log('API raw response:', data);
    if (Array.isArray(data)) {
      this.SalesOrders = data;
      this.noData = this.SalesOrders.length === 0;
      this.isLoading = false;
      console.log('Parsed SalesOrders:', this.SalesOrders);
    } else {
       this.isLoading = false;
      console.error('Unexpected response format:', data);
      this.SalesOrders = [];
    }
  },
  error: (error) => {
    this.isLoading = false;
    this.noData = true;
    console.error('Error fetching sales orders:', error);
  }
});
}
else {
    alert('No customer ID found. Redirecting to login.');
    this.router.navigate(['/login']);
  }
}

  goBack() {
    this.router.navigate(['/intelligence']);
  }
}
