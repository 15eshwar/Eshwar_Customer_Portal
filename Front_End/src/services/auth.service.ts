import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
status: string;
message: string;
}

@Injectable({
providedIn: 'root',
})

export class AuthService {

    constructor(private http: HttpClient) {}

    login(customerID: string, password: string):
    Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`http://localhost:3000/api/auth/login`, {
    customerID,
    password,
    });
}  
}



