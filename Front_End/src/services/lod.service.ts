import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Delivery {
  CUSTOMER_ID: string;
  CUSTOMER_NAME: string;
  OBJ_CREATED_BY: string;
  DELIVERY_NO: string;
  DELIVERY_ITEM_NO: string;
  PLANNED_DEL_DATE: string;
  DELIVERY_DATE: string;
  ACTUAL_DEL_DATE: string;
  MATERIAL_NO: string;
  DELIVERY_TYPE: string;
  ITEM_CATEGORY: string;
  ITEM_PROSTO_AT: {
    WERKS: string;
  };
  SHIPPING_POINT: string;
}

@Injectable({
  providedIn: 'root'
})
export class LodService {


  constructor(private http: HttpClient) {}

  getDeliveries(customerID: string): Observable<{ deliveries : Delivery[] }> {
    return this.http.post<{ deliveries: Delivery[] }>(`http://localhost:3000/api/lod/list-of-delivery`, {
      customerID
    });
  }
}


