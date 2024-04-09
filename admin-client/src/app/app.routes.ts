import { Routes } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';

export const routes: Routes = [
  {
    path: '',
    component:  SidenavComponent,
    children: [
      {
        path: 'categories',
        loadComponent:  () => import('./categoy/categoy.component').then((comp) => comp.CategoyComponent )
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'categories'
      }
    ]
  }
];
