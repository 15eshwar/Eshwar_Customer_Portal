import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PayAgeItem {
  VBELN: string;
  FKDAT: string;
  DUE_DATE: string;
  NETWR: string;
  WAERK: string;
  AGING: string;
  AGING_DAYS: string;
}

@Injectable({
  providedIn: 'root'
})
export class PayageService {
  private apiUrl = 'http://localhost:3000/api/payage/pay-age-data';

  constructor(private http: HttpClient) {}

  getPayAgeData(customerID: string): Observable<{ customerID: string; payAgeData: PayAgeItem[] }> {
    return this.http.post<{ customerID: string; payAgeData: PayAgeItem[] }>(this.apiUrl, {
      customerID
    });
  }
}
