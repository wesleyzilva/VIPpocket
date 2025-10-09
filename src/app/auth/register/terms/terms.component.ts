import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  standalone: true,
  selector: 'app-terms',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCheckboxModule,
    MatFormFieldModule
  ],
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent {
  termsForm;

  constructor(private fb: FormBuilder, private router: Router) {
    this.termsForm = this.fb.group({
      accept: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.termsForm.valid) {
      // Navega para a próxima etapa apenas se o formulário for válido.
      this.router.navigate(['/register/password']);
    }
  }
}