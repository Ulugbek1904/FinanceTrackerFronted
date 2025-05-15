import { AboutComponent } from './pages/about/about.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  }, 
  {
    path: 'login',
    component: LoginComponent
  },  {
    path: 'about',
    component: AboutComponent
  },
  { path: 'unauthorized', component: UnauthorizedComponent },

];
