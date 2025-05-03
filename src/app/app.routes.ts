import { AboutComponent } from './pages/about/about.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { AdminDashboardComponent } from './pages/dashboard/admin-dashboard/admin-dashboard.component';
import { SuperadminDashboardComponent } from './pages/dashboard/superadmin-dashboard/superadmin-dashboard.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { UserDashboardComponent } from './pages/dashboard/user-dashboard/user-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },  {
    path: 'login',
    component: LoginComponent
  },  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'user',
        component: UserDashboardComponent,
        canActivate: [roleGuard],
        data: { roles: ['User'] },
      },
      {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [roleGuard],
        data: { roles: ['Admin'] },
      },
      {
        path: 'superadmin',
        component: SuperadminDashboardComponent,
        canActivate: [roleGuard],
        data: { roles: ['SuperAdmin'] },
      }
    ]
  },   
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: '' },
];
