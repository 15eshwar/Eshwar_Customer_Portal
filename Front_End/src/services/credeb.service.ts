import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CDdata{
  DOCUMENT_NO: string;
  DOC_DATE: string;
  BILL_TYPE: string;
  CURRENCY: string;
  CUSTOMER_NO: string;
  SALES_ORG: string;
  AMOUNT: string;
  CREATED_BY: string;
  CREATED_ON: string;
  ENTRY_TIME: string;
  SOLD_TO_PARTY: string;
  SALES_ORDR: string;
  MATERIAL_NO: string;
  BILL_ITEM: string;
  SALES_UNIT: string;
}

@Injectable({
  providedIn: 'root'
})
export class CredebService{

  constructor(private http: HttpClient) {}

  getCreditdebits(customerID: string): Observable<{ creditMemos: CDdata[] }> {
    return this.http.post<{ creditMemos: CDdata[]}>(`http://localhost:3000/api/credit_debit/credit-memo-data`, {
      customerID
      });
  }
}