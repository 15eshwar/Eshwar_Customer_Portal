import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalesOrder {
  CUSTOMER_ID: string;
  CUSTOMER_NAME: string;
  SALES_OR_NO: string;
  SALES_OR_DATE: string;
  SALES_DOC_TYPE: string;
  MATERIAL_NO: string;
  MATERIAL_DESCRIPT: string;
  ORDER_QTY: string;
  SALES_UNIT: string;
  SALES_ORG: string;
  SD_DOC_CURR: string;
  SALES_DOC_ITEM_NO: string;
  CONFIRMED_QTY: string;
  DELIVERY_DATE: string;
  PRICE_COND_AMNT: string;
  PRICE_COND_VAL: string;
  OVERALL_STATUS: string;
  DELIVERY_STATUS: string;

}

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {

  constructor(private http: HttpClient) {}

  getSalesOrders(customerID: string): Observable<{ SalesOrders: SalesOrder[] }> {
    return this.http.post<{ SalesOrders: SalesOrder[] }>(`http://localhost:3000/api/salesOrder/sales-order`, {
      customerID
      });
  }

}