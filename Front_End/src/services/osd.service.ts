import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OverallSalesData {
  CUSTOMER_ID: string;
  CUSTOMER_NAME: string;
  SALES_DOC_NO: string;
  MATERIAL_NO: string;
  REC_CREATION_DATE: string;
  SALES_UNIT: string;
  BILLING_DATE: string;
  BILLING_DOC_NO: string;
  NET_BILLING_VAL: number;
  BILL_CURR: string;
  BILLING_ITEM: string;
}

@Injectable({
  providedIn: 'root'
})

export class OsdService {

  constructor(private http: HttpClient) {}

  getOsd(customerID: string): Observable<{ records : OverallSalesData [] }> {
    return this.http.post<{ records : OverallSalesData [] }>(`http://localhost:3000/api/osd/overall-sales-data`, {
      customerID
    });
  }
}


