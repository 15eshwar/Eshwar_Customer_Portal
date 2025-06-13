import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intel-profile',
  imports: [],
  templateUrl: './intel-profile.component.html',
  styleUrl: './intel-profile.component.css'
})
export class IntelProfileComponent {

 constructor(private router: Router) {}

  goDataInquiry(){
this.router.navigate(['/data-inquiry']);
}
goSalesOrder(){
  this.router.navigate(['/sales-order']);
}
goLOD(){
  this.router.navigate(['/List-of-Delivery']);
}
   goBack() {
    this.router.navigate(['/home']);
  }
}
