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
        path: 'amenities',
        loadComponent: () => import('./amenity/amenity.component').then(comp => comp.AmenityComponent)

      },
      {
        path: 'courses',
        loadComponent: () => import('./course/course.component').then(comp => comp.CourseComponent) 
      },
      {
        path: 'banners',
        loadComponent: () => import('./banner/banner.component').then((comp) => comp.BannerComponent)

      },
      {
        path: 'enquiries',
        loadComponent: () => import('./enquiry/enquiry.component').then((comp) => comp.EnquiryComponent)
      },
      {
        path: 'general-details',
        loadComponent: () => import('./general-details/general-details.component').then((comp) => comp.GeneralDetailsComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'categories'
      }
    ]
  }
];
