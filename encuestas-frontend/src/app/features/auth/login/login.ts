import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  // Formulario reactivo con campos obligatorios
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  errorMessage = '';
  hidePassword = true;

  ngOnInit() {
    // Verificar si viene de un logout por desactivación
    this.route.queryParams.subscribe(params => {
      if (params['desactivado'] === 'true') {
        this.errorMessage = 'Tu cuenta ha sido desactivada por el administrador. Contacta al administrador para reactivarla.';
      }
    });
  }

  onSubmit() {
    // Si el formulario es inválido, marcamos los campos para que Angular Material muestre los errores visuales
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    
    this.authService.login(email, password).subscribe({
      next: () => {},
      error: () => {
        this.errorMessage = 'Credenciales inválidas. Usá admin@test.com/admin123 o encuestador@test.com/encuestador123';
      }
    });
  }
}