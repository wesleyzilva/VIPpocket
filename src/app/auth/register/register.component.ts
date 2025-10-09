import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegistrationService } from './registration.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomDateAdapter } from './custom-date-adapter';

export function ageValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Deixa a validação de 'required' cuidar de valores vazios
    }

    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= minAge ? null : { 'minAge': { requiredAge: minAge, actualAge: age } };
  };
}

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class Register implements OnInit {
  registerForm;
  filteredStates!: Observable<any[]>;
  filteredCities!: Observable<string[]>;
  cities: { [key: string]: string[] } = {
    SP: ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André', 'Osasco', 'Ribeirão Preto', 'Sorocaba', 'Santos'],
    RJ: ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói', 'Belford Roxo'],
    MG: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros'],
    BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari'],
    PR: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'],
    RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria'],
    PE: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Paulista'],
    CE: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú'],
    DF: ['Brasília'],
    AM: ['Manaus', 'Parintins', 'Itacoatiara'],
    SC: ['Joinville', 'Florianópolis', 'Blumenau', 'São José', 'Chapecó'],
    GO: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde']
  };
  states = [
    { name: 'Acre', abbr: 'AC' }, { name: 'Alagoas', abbr: 'AL' },
    { name: 'Amapá', abbr: 'AP' }, { name: 'Amazonas', abbr: 'AM' },
    { name: 'Bahia', abbr: 'BA' }, { name: 'Ceará', abbr: 'CE' },
    { name: 'Distrito Federal', abbr: 'DF' }, { name: 'Espírito Santo', abbr: 'ES' },
    { name: 'Goiás', abbr: 'GO' }, { name: 'Maranhão', abbr: 'MA' },
    { name: 'Mato Grosso', abbr: 'MT' }, { name: 'Mato Grosso do Sul', abbr: 'MS' },
    { name: 'Minas Gerais', abbr: 'MG' }, { name: 'Pará', abbr: 'PA' },
    { name: 'Paraíba', abbr: 'PB' }, { name: 'Paraná', abbr: 'PR' },
    { name: 'Pernambuco', abbr: 'PE' }, { name: 'Piauí', abbr: 'PI' },
    { name: 'Rio de Janeiro', abbr: 'RJ' }, { name: 'Rio Grande do Norte', abbr: 'RN' },
    { name: 'Rio Grande do Sul', abbr: 'RS' }, { name: 'Rondônia', abbr: 'RO' },
    { name: 'Roraima', abbr: 'RR' }, { name: 'Santa Catarina', abbr: 'SC' },
    { name: 'São Paulo', abbr: 'SP' }, { name: 'Sergipe', abbr: 'SE' },
    { name: 'Tocantins', abbr: 'TO' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registrationService: RegistrationService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      birthDate: ['', [Validators.required, ageValidator(18)]],
      address: this.fb.group({
        cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
        street: ['', Validators.required],
        number: ['', Validators.required],
        neighborhood: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
      }),
    });
  }

  ngOnInit() {
    this.filteredStates = this.registerForm.get('address.state')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStates(value || ''))
    );

    // Desabilita o campo de cidade inicialmente
    const cityControl = this.registerForm.get('address.city')!;
    cityControl.disable();

    // Observa mudanças no campo de estado para atualizar as cidades
    this.registerForm.get('address.state')!.valueChanges.subscribe(stateName => {
      cityControl.setValue(''); // Limpa a cidade ao trocar de estado
      const selectedState = this.states.find(s => s.name === stateName);
      if (selectedState && this.cities[selectedState.abbr]) {
        cityControl.enable();
      } else {
        cityControl.disable(); // Desabilita se o estado for inválido
      }
    });

    this.filteredCities = cityControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCities(value || ''))
    );
  }

  private _filterStates(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.states.filter(state => state.name.toLowerCase().includes(filterValue));
  }

  private _filterCities(value: string): string[] {
    const filterValue = value.toLowerCase();
    const stateName = this.registerForm.get('address.state')?.value;
    const selectedState = this.states.find(s => s.name === stateName);

    if (!selectedState || !this.cities[selectedState.abbr]) {
      return [];
    }
    const citiesForState = this.cities[selectedState.abbr];
    return citiesForState.filter(city => city.toLowerCase().includes(filterValue));
  }

  formatCep(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não for dígito
    if (value.length > 5) {
      value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    input.value = value;
  }

  formatCpf(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não for dígito

    // Aplica a formatação XXX.XXX.XXX-XX
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    input.value = value;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.registrationService.setRegistrationData(this.registerForm.getRawValue());
      console.log('Step 1 data saved:', this.registrationService.getRegistrationData());
      this.router.navigate(['/register/terms']);
    }
  }
}
