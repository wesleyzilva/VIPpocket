import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

// Importa a configuração de localidade para o português do Brasil
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

// Registra a localidade
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideNativeDateAdapter(), // Adiciona o provedor para o DateAdapter
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }, // Define o locale para o datepicker
    { provide: LOCALE_ID, useValue: 'pt-BR' } // Define o locale para pipes (como o de moeda)
  ]
};