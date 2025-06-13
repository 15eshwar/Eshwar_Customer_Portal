import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {LodService , Delivery} from '../../../services/lod.service';


@Component({
  selector: 'app-lod',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './lod.component.html',
  styleUrls: ['./lod.component.css']
})
export class LodComponent implements OnInit{

isLoading: boolean = true;
noData: boolean = false;

 deliveries: Delivery[] = [];

constructor( private lodService: LodService ,private router: Router) {}
ngOnInit(): void {
  const customerID = localStorage.getItem('customerID');
  console.log(customerID);

  if (customerID) {
    this.lodService.getDeliveries(customerID).subscribe({
      next: (data) => {
        console.log('API response:', data);
        this.deliveries = (data?.deliveries ?? []).filter(item => item != null);
        this.noData = !this.deliveries.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching deliveries:', error);
        this.deliveries = [];
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
    this.router.navigate(['/intelligence']);
  }

}



