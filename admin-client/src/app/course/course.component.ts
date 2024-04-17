import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

export interface Course {
  _id: string;
  name: string;
  isActive: boolean;
  imageUrl: string;
}

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css',
})
export class CourseComponent implements OnInit {
  http = inject(HttpClient);
  matDialog = inject(MatDialog);

  displayedColumns: string[] = [ 'name', 'description', 'duration', 'type', 'actions'];
  dataSource: Course[] = [];

  ngOnInit(): void {
    this.http
      .get<{ data: Course[] }>(environment.baseUrl + '/courses')
      .subscribe((res) => {
        this.dataSource = res.data;
      });
  }

  openAddCategoryDialog() {
    // this.matDialog
    //   .open(AddCategoryFormComponent, { panelClass: 'rounded-full' })
    //   .afterClosed()
    //   .subscribe((result) => {
    //     console.log(result.get('image'));

    //     this.http.post(environment.baseUrl + '/categories', result).subscribe((result) => console.log(result));
    //   });
  }
}
