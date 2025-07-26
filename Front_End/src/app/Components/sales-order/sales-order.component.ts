import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesOrderService, SalesOrder } from '../../../services/salesOrder.service';

@Component({
  selector: 'app-sales-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-order.component.html',
  styleUrl: './sales-order.component.css'
})
export class SalesOrderComponent implements OnInit {

  isLoading: boolean = true;
  noData: boolean = false;
  SalesOrders: SalesOrder[] = [];

  filterText: string = '';
  sortColumn: string = 'SALES_ORDER_NO';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private salesOrderService: SalesOrderService,
    private router: Router
  ) {}

  get filteredAndSortedSalesOrders() {
    let filtered = this.SalesOrders;

    if (this.filterText) {
      const text = this.filterText.trim();
      const lowerText = text.toLowerCase();
      const upperText = text.toUpperCase();

      filtered = this.SalesOrders.filter(order => {
        const materialMatch = order.MATERIAL_DESCRIPT?.toLowerCase().includes(lowerText);
        const salesUnitMatch = order.SALES_UNIT?.toLowerCase().includes(lowerText);
        const salesOrgMatch = order.SALES_ORG?.toLowerCase().includes(lowerText);
        const currencyMatch = order.SD_DOC_CURR?.toLowerCase().includes(lowerText);
        const deliveryStatus = order.DELIVERY_STATUS?.trim().toUpperCase();
        const deliveryStatusMatch = deliveryStatus === upperText;

        let orderDateMatch = false;
        if (order.SALES_OR_DATE) {
          const [year, month, day] = order.SALES_OR_DATE.split('-');
          const formattedDate = `${day}-${month}-${year}`;
          orderDateMatch = formattedDate.toLowerCase().includes(lowerText);
        }

        if (upperText === 'A' || upperText === 'C') {
          return deliveryStatusMatch;
        }

        return (
          materialMatch ||
          salesUnitMatch ||
          salesOrgMatch ||
          currencyMatch ||
          deliveryStatusMatch ||
          orderDateMatch
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

  ngOnInit(): void {
    const customerID = localStorage.getItem('customerID');

    if (customerID) {
      this.salesOrderService.getSalesOrders(customerID).subscribe({
        next: (data) => {
          if (Array.isArray(data)) {
            this.SalesOrders = data;
            this.noData = this.SalesOrders.length === 0;
            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.SalesOrders = [];
          }
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
    this.router.navigate(['/intelligence']);
  }

  removeLeadingZeros(value: string | number): string {
    return value != null ? String(Number(value)) : '';
  }

  formatDateToDMY(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }
}
