import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatDialogModule } from '@angular/material/dialog';
import { Category } from '../categoy/categoy.component';
import { Amenity } from '../amenity/amenity.component';
import { Course } from '../course/course.component';
import { SharedModule } from '../shared/shared.module';
import { PostFormComponent } from './post-form/post-form.component';
import { Router, RouterLink, RouterModule } from '@angular/router';

export interface Post {
  _id: string;
  coverImageUrl: string;
  title: string;
  isActive: boolean;
  category: Category;
  isCategoryActive: boolean;
  description: string;
  amenities: Amenity[];
  courses: Course[];
  gallery: string[];
  contactNumber: string;
  brochureUrl?: string;
}

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    SharedModule,
    RouterLink
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);

  displayedColumns: string[] = [
    'coverImageUrl',
    'title',
    'status',
    'category',
    'contactNumber',
    'courses',
    'amenities',
    'actions',
  ];
  dataSource: Post[] = [];

  ngOnInit(): void {
    this.http
      .get<{ data: Post[] }>(environment.baseUrl + '/posts')
      .subscribe((res) => {
        console.log(res.data);
        this.dataSource = res.data;
      });
  }

  openAddInstitutionDialog() {
    this.router.navigate(['institutions', 'add-institution']);
  }

  onRowClicked() {}
}
