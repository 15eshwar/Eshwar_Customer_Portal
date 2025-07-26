import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface invoice {
  KUNAG: string;       // Customer ID
  VBELN: string;       // Billing Document Number
  FKDAT: string;       // Billing Date
  FKART: string;       // Billing Type
  KNUMV: string;       // Document Condition Number
  FKIMG: string;       // Billing Quantity
  MATNR: string;       // Material Number
  NETWR: string;       // Net Value
  WAERK: string;       // Currency
  POSNR: string;       // Item Number
  ITEM_NETWR: string;  // Item Net Value
  PRSDT: string;       // Pricing Date
  VKORG: string;       // Sales Org
  VRKME: string;       // Sales Unit
  ARKTX: string;       //  product description
}
@Injectable({
  providedIn: 'root'
})

export class InvoiceDisplayService {
 
  constructor(private http: HttpClient) {}

  getInvoices(customerID: string): Observable<{ records: invoice[] }> {
    return this.http.post<{ records : invoice[] }>(`http://localhost:3000/api/invoiceD/invoice-display`, {
      customerID
      });     
  }

downloadInvoicePDF(vbeln: string): Observable<Blob> {
  return this.http.post(
    'http://localhost:3000/api/invoice_pdf/invoice-download',
    { invoiceNumber: vbeln },
    { responseType: 'blob' } // blob
  );
}

}
