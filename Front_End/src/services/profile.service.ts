import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomerProfile {
  customerID: string;
  customerName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}


@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfile(customerID: string): Observable<CustomerProfile> {
    return this.http.post<CustomerProfile>(`http://localhost:3000/api/Profile/profile/`, {
    customerID
    });
  }
}
