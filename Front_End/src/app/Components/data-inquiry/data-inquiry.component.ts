import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InquiryService, Inquiry } from '../../../services/inquiry.service';

@Component({
  selector: 'app-data-inquiry',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './data-inquiry.component.html',
  styleUrl: './data-inquiry.component.css'
})
export class DataInquiryComponent implements OnInit{

isLoading: boolean = true;
noData: boolean = false;
  
inquiries: Inquiry[] = [];

filterText: string = '';
sortColumn: string = 'INQUIRY_DATE';
sortOrder: 'asc' | 'desc' = 'asc';

get filteredAndSortedInquiries() {
  let filtered = this.inquiries;

  if (this.filterText) {
    const text = this.filterText.toLowerCase();
    filtered = filtered.filter(inquiry => {
      const docNoMatch = inquiry.SALES_DOC_NO?.toString().includes(text);
      const materialMatch = inquiry.MATERIAL_DESCRIPT?.toLowerCase().includes(text);
     let dateMatch = false;
if (inquiry.INQUIRY_DATE) {
  const [year, month, day] = inquiry.INQUIRY_DATE.split('-'); // from backend: YYYY-MM-DD
  const formattedDate = `${day}-${month}-${year}`; // DD-MM-YYYY
  dateMatch = formattedDate.toLowerCase().includes(text);
}
      return docNoMatch || materialMatch || dateMatch;
    });
  }

  return filtered.sort((a, b) => {
    const valA = (a as any)[this.sortColumn];
    const valB = (b as any)[this.sortColumn];

    if (valA == null || valB == null) return 0;

    let comparison = 0;
    if (typeof valA === 'string') {
      comparison = valA.localeCompare(valB);
    } else if (!isNaN(valA) && !isNaN(valB)) {
      comparison = valA - valB;
    }

    return this.sortOrder === 'asc' ? comparison : -comparison;
  });
}

toggleSortOrder() {
  this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
}


constructor(private inquiryService: InquiryService, private router: Router) {}

  ngOnInit(): void {
     const customerID = localStorage.getItem('customerID');
    console.log(customerID)
if (customerID) {
  this.inquiryService.getInquiries(customerID).subscribe({
  next: (data) => {
    this.inquiries = data.inquiries;
    this.noData = this.inquiries.length === 0;
    this.isLoading = false;
    console.log('API response:', data);  
  },
    error: (error) => {
      console.error('Error fetching inquiries:', error);
      this.isLoading = false;
      this.noData = true;
    }
  });

 }else{
   alert('No customer ID found. Redirecting to login.');
      this.router.navigate(['/login']);
 } 
  }
  goBack() {
    this.router.navigate(['/intelligence']);
  }
formatDateToDMY(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
}
  removeLeadingZeros(value: string | number): string {
  return value != null ? String(Number(value)) : '';
}
}

