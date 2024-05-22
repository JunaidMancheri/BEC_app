import { Routes } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';
import { PostFormComponent } from './post/post-form/post-form.component';

export const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [
      {
        path: 'categories',
        loadComponent: () =>
          import('./categoy/categoy.component').then(
            (comp) => comp.CategoyComponent
          ),
      },
      {
        path: 'amenities',
        loadComponent: () =>
          import('./amenity/amenity.component').then(
            (comp) => comp.AmenityComponent
          ),
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./course/course.component').then(
            (comp) => comp.CourseComponent
          ),
      },
      {
        path: 'banners',
        loadComponent: () =>
          import('./banner/banner.component').then(
            (comp) => comp.BannerComponent
          ),
      },
      {
        path: 'enquiries',
        loadComponent: () =>
          import('./enquiry/enquiry.component').then(
            (comp) => comp.EnquiryComponent
          ),
      },
      {
        path: 'general-details',
        loadComponent: () =>
          import('./general-details/general-details.component').then(
            (comp) => comp.GeneralDetailsComponent
          ),
      },
      {
        path: 'institutions',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./post/post.component').then(
                (comp) => comp.PostComponent
              ),
          },
          {
            path: 'add-institution',
            loadComponent: () =>
              import('./post/post-form/post-form.component').then(
                (comp) => comp.PostFormComponent
              ),
          },
          {
            path: ':institution',
            loadComponent: () =>
              import('./post/single-post/single-post.component').then(
                (comp) => comp.SinglePostComponent
              ),
          },
        ],
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'categories',
      },
    ],
  },
];
