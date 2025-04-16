import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localeEsMX);

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideRouter(routes),
    provideHttpClient(),

    { provide: LOCALE_ID, useValue: 'es-MX' }
  ]
}).catch((err) => console.error(err));
