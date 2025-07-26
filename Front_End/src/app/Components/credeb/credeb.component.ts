import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { CommonModule} from '@angular/common';
import { CredebService,CDdata } from '../../../services/credeb.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-credeb',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './credeb.component.html',
  styleUrl: './credeb.component.css'
})
export class CredebComponent implements OnInit {

isLoading: boolean = true;
noData: boolean = false;

creditMemos: CDdata[] =[];

constructor(private credebService: CredebService, private router: Router) {}

filterText: string = '';
sortColumn: string = 'DOCUMENT_NO';
sortOrder: 'asc' | 'desc' = 'asc';

toggleSortOrder() {
  this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
}

get filteredAndSortedCreditMemos() {
  let result = this.creditMemos;

  if (this.filterText) {
    const text = this.filterText.toLowerCase();

    result = result.filter(memo => {
      const docNo = this.removeLeadingZeros(memo.DOCUMENT_NO).toLowerCase();
      const docDate = this.formatDateToDMY(memo.DOC_DATE).toLowerCase();
      const billType = memo.BILL_TYPE?.toLowerCase() || '';
      const currency = memo.CURRENCY?.toLowerCase() || '';
      const material = memo.SALES_ORDR?.toLowerCase() || '';

      return (
        docNo.includes(text) ||
        docDate.includes(text) ||
        billType.includes(text) ||
        currency.includes(text) ||
        material.includes(text)
      );
    });
  }

  return result.sort((a, b) => {
    const valA = (a as any)[this.sortColumn];
    const valB = (b as any)[this.sortColumn];

    if (valA == null || valB == null) return 0;

    let comparison = 0;
    if (typeof valA === 'string' && typeof valB === 'string') {
      comparison = valA.localeCompare(valB);
    } else if (!isNaN(valA) && !isNaN(valB)) {
      comparison = +valA - +valB;
    }

    return this.sortOrder === 'asc' ? comparison : -comparison;
  });
}


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

  removeLeadingZeros(value: string | number): string {
  return value != null ? String(Number(value)) : '';
}

formatDateToDMY(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
}

}


