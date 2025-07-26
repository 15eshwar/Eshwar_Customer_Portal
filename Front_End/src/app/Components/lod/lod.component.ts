import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LodService, Delivery } from '../../../services/lod.service';

@Component({
  selector: 'app-lod',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lod.component.html',
  styleUrls: ['./lod.component.css']
})
export class LodComponent implements OnInit {

  isLoading = true;
  noData = false;
  deliveries: Delivery[] = [];

  filterText = '';
  sortColumn: string = 'DELIVERY_NO';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private lodService: LodService, private router: Router) {}

  ngOnInit(): void {
    const customerID = localStorage.getItem('customerID');

    if (customerID) {
      this.lodService.getDeliveries(customerID).subscribe({
        next: (data) => {
          this.deliveries = (data?.deliveries ?? []).filter(item => item != null);
          this.noData = !this.deliveries.length;
          this.isLoading = false;
        },
        error: () => {
          this.deliveries = [];
          this.noData = true;
          this.isLoading = false;
        }
      });
    } else {
      alert('No customer ID found. Redirecting to login.');
      this.router.navigate(['/login']);
    }
  }

  get filteredDeliveries() {
    const search = this.filterText?.toLowerCase() || '';

    const filtered = this.deliveries.filter(delivery => {
      const deliveryNo = this.removeLeadingZeros(delivery.DELIVERY_NO || '').toLowerCase();
      const deliveryDate = this.formatDateToDMY(delivery.DELIVERY_DATE || '').toLowerCase();
      return deliveryNo.includes(search) || deliveryDate.includes(search);
    });

    return filtered.sort((a, b) => {
      const valA = this.getSortableValue(a, this.sortColumn);
      const valB = this.getSortableValue(b, this.sortColumn);
      return this.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }

  getSortableValue(item: any, column: string): string {
    const value = item[column];
    if (!value) return '';
    return typeof value === 'string'
      ? value.toLowerCase()
      : this.removeLeadingZeros(value.toString().toLowerCase());
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
    this.router.navigate(['/intelligence']);
  }
}
