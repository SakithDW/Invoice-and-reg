import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthGuard } from './Guard/auth.guard';
import { AuthService } from './services/auth.service';
import { MasterService } from './services/master.service'; 
import { Authinterceptor } from './Interceptor/auth.interceptor';
import { ProductService } from './services/product.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { InvoiceService } from './services/invoice.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    AuthService,
    MasterService,
    ProductService,
    InvoiceService,
    { provide: HTTP_INTERCEPTORS, useClass: Authinterceptor, multi: true }, provideAnimationsAsync('noop')
  ]
};
