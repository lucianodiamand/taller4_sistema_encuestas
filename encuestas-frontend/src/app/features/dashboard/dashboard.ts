import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  authService = inject(AuthService);
  role = this.authService.currentUserRole(); // 'ADMIN' o 'ENCUESTADOR'

  logout() {
    this.authService.logout();
  }
}