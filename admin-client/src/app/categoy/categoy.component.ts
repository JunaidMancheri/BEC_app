import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SharedModule } from '../shared/shared.module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddCategoryFormComponent } from './add-category-form/add-category-form.component';

export interface Category {
  _id: string;
  name: string;
  isActive: boolean;
  imageUrl: string;
}

@Component({
  selector: 'app-categoy',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    SharedModule,
    MatDialogModule,
  ],
  templateUrl: './categoy.component.html',
  styleUrl: './categoy.component.css',
})
export class CategoyComponent implements OnInit {
  http = inject(HttpClient);
  matDialog = inject(MatDialog);

  displayedColumns: string[] = ['image', 'name', 'status', 'actions'];
  dataSource: Category[] = [];

  ngOnInit(): void {
    this.http
      .get<{ data: Category[] }>(environment.baseUrl + '/categories')
      .subscribe((res) => {
        this.dataSource = res.data;
      });
  }

  openAddCategoryDialog() {
    this.matDialog
      .open(AddCategoryFormComponent, { panelClass: 'rounded-full', disableClose: true })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.dataSource = [...this.dataSource, result]
                 
      });
  }
}
