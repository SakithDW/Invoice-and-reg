import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './Guard/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { BillingComponent } from './components/billing/billing.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },

  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'registration',
        component: RegisterComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'invoice',
        component: BillingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'help',
        component: RegisterComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];
