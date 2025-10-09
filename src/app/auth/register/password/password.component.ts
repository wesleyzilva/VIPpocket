import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { RegistrationService } from '../registration.service';
// Custom Validator to check if passwords match
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // If the confirm password field is empty, don't set an error yet
  if (!password || !confirmPassword || !confirmPassword.value) {
    return null;
  }

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  standalone: true,
  selector: 'app-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss'
})
export class Password implements OnInit {
  passwordForm;
  isSubmitted = false;
  registrationData: any = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registrationService: RegistrationService
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    this.registrationData = this.registrationService.getRegistrationData();
    // If we navigate directly to this page, the service data might be empty.
    // Let's fill it with fake data for development purposes if needed.
    if (Object.keys(this.registrationData).length === 0) {
      console.warn('Dados da primeira etapa não encontrados. Usando dados fake para desenvolvimento.');
      this.registrationData = { fullName: 'Usuário Teste', email: 'teste@email.com' };
    }
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const step1Data = this.registrationService.getRegistrationData();
      const finalRegistrationData = { ...step1Data, password: this.passwordForm.value.password };

      // TODO: Call API to create user with finalRegistrationData
      console.log('Final registration data:', finalRegistrationData);
      this.isSubmitted = true;
    }
  }
}
