import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OsdService, OverallSalesData } from '../../../services/osd.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-osd',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './osd.component.html',
  styleUrls: ['./osd.component.css']
})
export class OsdComponent implements OnInit {
  isLoading: boolean = true;
  noData: boolean = false;
  records: OverallSalesData[] = [];
  filterText: string = '';
  sortColumn: 'BILLING_DOC_NO' | 'BILLING_DATE' | 'MATERIAL_NO' | 'BILLING_ITEM' = 'BILLING_DOC_NO';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private osdService: OsdService, private router: Router) {}

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }

  get filteredAndSortedRecords() {
    let filtered = this.records;

    if (this.filterText) {
      const text = this.filterText.trim().toLowerCase();
      filtered = this.records.filter(item => {
        const billingDocNo = this.removeLeadingZeros(item.BILLING_DOC_NO).toLowerCase();
        const billingDate = this.formatDateToDMY(item.BILLING_DATE).toLowerCase();
        const docType = item.SALES_DOC_NO?.toLowerCase() || '';
        const salesUnit = item.SALES_UNIT?.toLowerCase() || '';
        const billCurrency = item.BILL_CURR?.toLowerCase() || '';
        return (
          billingDocNo.includes(text) ||
          billingDate.includes(text) ||
          docType.includes(text) ||
          salesUnit.includes(text) ||
          billCurrency.includes(text)
        );
      });
    }

    return filtered.sort((a, b) => {
      const valA = (a[this.sortColumn] ?? '').toString().toLowerCase();
      const valB = (b[this.sortColumn] ?? '').toString().toLowerCase();
      const comparison = valA.localeCompare(valB);
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  ngOnInit(): void {
    const customerID = localStorage.getItem('customerID');
    if (customerID) {
      this.osdService.getOsd(customerID).subscribe({
        next: (data) => {
          this.records = (data?.records ?? []).filter(item => item != null);
          this.noData = this.records.length === 0;
          this.isLoading = false;
        },
        error: () => {
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
