import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-finance-sheet',
  imports: [],
  templateUrl: './finance-sheet.component.html',
  styleUrl: './finance-sheet.component.css'
})
export class FinanceSheetComponent {
 constructor(private router: Router) {}

goInvoice(){
  this.router.navigate(['/Invoice'])
}

goPA(){
this.router.navigate(['/Pay-age']);
}

goOSD(){
  this.router.navigate(['/Osales-Data']);
}
goCDMEMO(){
  this.router.navigate(['/Credit-Debit-MEMO']);
}
   goBack() {
    this.router.navigate(['/home']);
}
}