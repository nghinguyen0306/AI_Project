// src/app/pages/account/account.component.ts
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  standalone: true,
  imports: [IonicModule],  // Import IonicModule here
})
export class AccountComponent {
  constructor(private router: Router) {} // Inject Router

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
