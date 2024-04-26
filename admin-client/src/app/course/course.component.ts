import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SnackbarService } from '../shared/snackbar.service';

export interface Course {
  _id: string;
  name: string;
  isActive: boolean;
  imageUrl: string;
}

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css',
})
export class CourseComponent implements OnInit {
  http = inject(HttpClient);
  matDialog = inject(MatDialog);
  snackbarService = inject(SnackbarService);

  displayedColumns: string[] = [
    'name',
    'description',
    'duration',
    'type',
    'actions',
  ];
  dataSource: Course[] = [];

  ngOnInit(): void {
    this.http
      .get<{ data: Course[] }>(environment.baseUrl + '/courses')
      .subscribe((res) => {
        this.dataSource = res.data;
      });
  }

  deleteCourse(id: string) {
    this.http.delete(environment.baseUrl + '/courses/' + id).subscribe(() => {
      this.dataSource = this.dataSource.filter((item) => item._id !== id);
      this.snackbarService.openSnackbar('Deleted course successfully');
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
