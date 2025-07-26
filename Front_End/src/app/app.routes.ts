import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/home/home.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { WelcomeComponent } from './Components/welcome/welcome.component';
import { IntelProfileComponent } from './Components/intel-profile/intel-profile.component';
import { FinanceSheetComponent } from './Components/finance-sheet/finance-sheet.component';
import { DataInquiryComponent } from './Components/data-inquiry/data-inquiry.component';
import { SalesOrderComponent } from './Components/sales-order/sales-order.component';
import { LodComponent } from './Components/lod/lod.component';
import { OsdComponent } from './Components/osd/osd.component';
import { CredebComponent } from './Components/credeb/credeb.component';
import { PayageComponent } from './Components/payage/payage.component';
import { InvoiceComponent } from './Components/invoice/invoice.component';

export const routes: Routes = [
//Default Routing
{
path:'',
redirectTo: 'welcome',
pathMatch:'full'
},
{
    path:'welcome',
    component:WelcomeComponent
},
{
    path:'home',
    component:HomeComponent
},
{
    path:'login',
    component:LoginComponent
},
{
    path:'profile',
    component:ProfileComponent
},
{
    path:'intelligence',
    component:IntelProfileComponent
},
{
  path:'finance-sheet',
    component:FinanceSheetComponent
},
{
  path:'data-inquiry',
    component:DataInquiryComponent
},
{
      path:'sales-order',
    component:SalesOrderComponent
},
{
    path:'List-of-Delivery',
    component:LodComponent
},
{
  path:'Osales-Data',
    component:OsdComponent
},
{
   path:'Credit-Debit-MEMO',
    component:CredebComponent
},
{
 path:'Pay-age',
    component:PayageComponent
},
{
path:'Invoice',
    component:InvoiceComponent
}
];

