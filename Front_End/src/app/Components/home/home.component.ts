import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

constructor(private router: Router) {}
   showDropdown = false;
   @HostListener('window:scroll', [])
   onWindowScroll() {
     const navbar = document.querySelector('.navbar');
     if (window.pageYOffset > 0) {
       navbar?.classList.add('scrolled');
     } else {
       navbar?.classList.remove('scrolled');
     }
   }
  Dropdown() {
    this.showDropdown = !this.showDropdown;
  }
  goWelcome() {
    this.router.navigate(['/welcome']);
  }
  goLogout() {
    this.router.navigate(['/login']);
  }
  goContact() {
    this.router.navigate(['/contact']);
  }
  goProfile(){
  this.router.navigate(['/profile']);
  }
  goIntelligence(){
     this.router.navigate(['/intelligence']);
  }
  goFinanceSheet(){
    this.router.navigate(['/finance-sheet']);
  }
}
