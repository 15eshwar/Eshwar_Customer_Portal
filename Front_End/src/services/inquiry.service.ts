import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Inquiry {
  CUSTOMER_ID: string;
  CUSTOMER_NAME: string;
  SALES_DOC_NO: string;
  INQUIRY_DATE: string;
  MATERIAL_NO: string;
  MATERIAL_DESCRIPT: string;
  SALES_UNIT: string;
  SALES_DOC_TYPE: string;
  SALES_DOC_ITEM: string;
  SALES_ORG: string;
  SD_DOC_CURR: string;
  REQUESTED_QUAN: string;
}

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
 

  constructor(private http: HttpClient) {}

  getInquiries(customerID: string): Observable<{ inquiries: Inquiry[] }> {
    return this.http.post<{ inquiries: Inquiry[] }>(`http://localhost:3000/api/inquiry/salesInquiry`, {
      customerID
      });
  }

}
