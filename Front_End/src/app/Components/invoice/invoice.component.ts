import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InvoiceDisplayService,invoice } from '../../../services/invoiceD.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit {

isLoading: boolean = true;
noData: boolean = false;

records: invoice[] = [];

filterText = '';
sortColumn = 'VBELN';
sortOrder: 'asc' | 'desc' = 'asc';

get filteredAndSortedRecords() {
  let result = this.records;

if (this.filterText) {
  const text = this.filterText.toLowerCase();
  result = result.filter(item => {
    const formattedFKDAT = this.formatDateToDMY(item.FKDAT || '').toLowerCase();
    const combinedString =
      (item.VBELN || '') +
      formattedFKDAT +
      (item.FKART || '') +
      (item.KNUMV || '') +
      (item.WAERK || '') +
      (item.VRKME || '') +
      (item.ARKTX || '');
    return combinedString.toLowerCase().includes(text);
  });
}
  result = result.sort((a, b) => {
    const valueA = (a as any)[this.sortColumn];
    const valueB = (b as any)[this.sortColumn];
    if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  return result;
}

toggleSortOrder() {
  this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
}

constructor(private invoiceDisplayService :InvoiceDisplayService,private router:Router){}

ngOnInit(): void {
     const customerID = localStorage.getItem('customerID');
    console.log(customerID)
if (customerID) {
  this.invoiceDisplayService.getInvoices(customerID).subscribe({
  next: (data) => {
    this.records = (data?.records ?? []).filter(item => item != null);
    this.noData = this.records.length === 0;
    this.isLoading = false;
    console.log('API response:', data);   
  },
    error: (error) => {
      console.error('Error in fetching invoices:', error);
      this.isLoading = false;
      this.noData = true;
    }
  });

 }
}

downloadPDF(invoiceNumber: string) {
  this.invoiceDisplayService.downloadInvoicePDF(invoiceNumber).subscribe({
    next: (pdfBlob: Blob) => {
       console.log('Blob type:', pdfBlob.type);
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Invoice_${invoiceNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(blobUrl);
    },
    error: (err) => {
      console.error('PDF download failed:', err);
      alert('Download failed. Check console for details.');
    }
  });
}

  goBack(){
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
