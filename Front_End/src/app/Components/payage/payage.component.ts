import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PayageService, PayAgeItem } from '../../../services/payage.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payage',
  imports: [CommonModule, FormsModule],
  templateUrl: './payage.component.html',
  styleUrl: './payage.component.css'
})
export class PayageComponent implements OnInit {

  isLoading: boolean = true;
  noData: boolean = false;
  filterText: string = '';
  sortColumn: string = 'VBELN';
  sortOrder: 'asc' | 'desc' = 'asc';
  payAgeData: PayAgeItem[] = [];

  constructor(
    private payageService: PayageService,
    private router: Router
  ) {}

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

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }

  get filteredAndSortedPayAgeData() {
    let filtered = this.payAgeData;

    if (this.filterText) {
      const text = this.filterText.trim().toLowerCase();

      filtered = filtered.filter(item => {
        const docNo = this.removeLeadingZeros(item.VBELN).toLowerCase();
        const invoiceDate = this.formatDateToDMY(item.FKDAT).toLowerCase();
        const dueDate = this.formatDateToDMY(item.DUE_DATE).toLowerCase();
        const amount = item.NETWR?.toString().toLowerCase();
        const currency = item.WAERK?.toLowerCase();
        const aging = item.AGING?.toLowerCase();
        const agingDays = item.AGING_DAYS?.toString().toLowerCase();

        return (
          docNo.includes(text) ||
          invoiceDate.includes(text) ||
          dueDate.includes(text) ||
          amount?.includes(text) ||
          currency?.includes(text) ||
          aging?.includes(text) ||
          agingDays?.includes(text)
        );
      });
    }

    return filtered.sort((a, b) => {
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

  removeLeadingZeros(value: string | number): string {
    return value != null ? String(Number(value)) : '';
  }

  formatDateToDMY(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }

  goBack() {
    this.router.navigate(['finance-sheet']);
  }
}
