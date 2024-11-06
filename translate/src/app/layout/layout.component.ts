import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { AuthService } from './../services/auth.service';
import { UsersService } from './../services/users.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    IonicModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    CommonModule,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  // Observable for the current user profile
  user$ = this.usersService.currentUserProfile$;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router
  ) {
    this.user$.subscribe(user => console.log('Current user profile:', user));

  }

  // Logout method to navigate away after logging out
  logout() {
    this.authService.logout().subscribe(() => {
      console.log('Logged out');
      this.router.navigate(['/login']); // Redirect to login or home after logout
    });
  }
}
