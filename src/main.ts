import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { providePrimeNG } from 'primeng/config';
import { Router, Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { ThemeProvider } from 'primeng/config';
import lara from '@primeng/themes/nora'


bootstrapApplication(AppComponent, {
  ...appConfig, // Expande las configuraciones de appConfig
  providers: [
    ...appConfig.providers, // Asegura que los providers deh appConfig sean incluidos
    provideRouter(routes), // Agrega la configuración de rutas
    provideHttpClient(),
    
  ],
}).catch((err) => console.error(err));

