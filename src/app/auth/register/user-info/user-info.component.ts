import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface State {
  name: string;
  cities: string[];
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatCheckboxModule
  ],
  templateUrl: './user-info.component.html'
})
export class Register implements OnInit {
  registerForm: FormGroup;
  states: State[] = [{ name: 'São Paulo', cities: ['São Paulo', 'Campinas', 'Santos'] }, { name: 'Rio de Janeiro', cities: ['Rio de Janeiro', 'Niterói'] }];
  filteredStates!: Observable<State[]>;
  filteredCities!: Observable<string[]>;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      birthDate: ['', Validators.required],
      address: this.fb.group({
        cep: ['', [Validators.pattern(/^\d{5}-\d{3}$/)]],
        street: [''],
        number: [''],
        neighborhood: [''],
        state: ['', Validators.required],
        city: ['']
      })
    });
  }

  ngOnInit(): void {
    this.preencherFormularioParaTeste();

    this.filteredStates = this.registerForm.get('address.state')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStates(value || '')),
    );

    this.filteredCities = this.registerForm.get('address.city')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCities(value || '')),
    );
  }

  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();
    return this.states.filter(state => state.name.toLowerCase().includes(filterValue));
  }

  private _filterCities(value: string): string[] {
    const selectedStateName = this.registerForm.get('address.state')?.value;
    const selectedState = this.states.find(s => s.name === selectedStateName);
    if (!selectedState) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return selectedState.cities.filter(city => city.toLowerCase().includes(filterValue));
  }

  preencherFormularioParaTeste(): void {
    this.registerForm.patchValue({
      fullName: 'Cliente VIP Teste',
      email: 'cliente.vip@teste.com',
      cpf: '123.456.789-00',
      birthDate: new Date('1990-01-15T00:00:00'),
      address: {
        cep: '12345-678',
        street: 'Rua dos Testes',
        number: '123',
        neighborhood: 'Bairro da Simulação',
        state: 'São Paulo',
        city: 'São Paulo'
      }
    });
  }

  formatCpf(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.registerForm.get('cpf')?.setValue(value, { emitEvent: false });
  }

  formatCep(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    this.registerForm.get('address.cep')?.setValue(value, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Formulário enviado:', this.registerForm.value);
      this.router.navigate(['/register/terms']);
    }
  }
}