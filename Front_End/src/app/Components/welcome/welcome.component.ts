import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-welcome',
  imports: [],
  standalone:true,
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})

export class WelcomeComponent {

constructor(private router: Router) {}

 goWelcome() {
    this.router.navigate(['/welcome']);
  }
  goLogin() {
    this.router.navigate(['/login']);
  }
  goContact() {
    this.router.navigate(['/contact']);
  }
}
