import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';
import { inject, LOCALE_ID } from '@angular/core';
import { AuthInterceptor } from './token.interceptor';

registerLocaleData(localeEsMX);

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        AuthInterceptor  // 👈 debe ser la función, no una clase
      ])
    ),


    { provide: LOCALE_ID, useValue: 'es-MX' }
  ]
}).catch((err) => console.error(err));
