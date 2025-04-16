import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara'; // ✅ Tema rosa
import Material from '@primeng/themes/material'
import Nora from '@primeng/themes/nora'
import { LadiesPreset } from './ladiespre/ladiespre.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
          preset: LadiesPreset,
          options: {
            darkModeSelector: '.dark-mode' // Desactiva el modo oscuro
          }
          
      }
  })
    
  ]
};
