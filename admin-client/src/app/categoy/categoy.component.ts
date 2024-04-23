import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SharedModule } from '../shared/shared.module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddCategoryFormComponent } from './add-category-form/add-category-form.component';
import { SnackbarService } from '../shared/snackbar.service';
import { NgOptimizedImage } from '@angular/common';

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
    NgOptimizedImage,
  ],
  templateUrl: './categoy.component.html',
  styleUrl: './categoy.component.css',
})
export class CategoyComponent implements OnInit {
  http = inject(HttpClient);
  matDialog = inject(MatDialog);
  snackbarService = inject(SnackbarService);

  displayedColumns: string[] = ['image', 'name', 'status', 'actions', 'edit'];
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
      .open(AddCategoryFormComponent, {
        panelClass: 'rounded-full',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.dataSource = [...this.dataSource, result];
      });
  }

  editCategory(id: string, name: string) {
    this.matDialog
      .open(AddCategoryFormComponent, {
        data: { name: name, id },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res) => {
        console.log(res);
        if (res) {
          this.dataSource = this.dataSource.map((item) => {
            if (item._id == res._id) {
              return res;
            }
            return item;
          });
        }
      });
  }

  onToggleActive(e: MatSlideToggleChange, id: string) {
    this.http
      .patch<{ data: Category }>(
        environment.baseUrl + '/categories/' + id + '/toggle-status',
        {}
      )
      .subscribe({
        next: (res) => {
          this.dataSource = this.dataSource.map((item) => {
            if (item._id === id) {
              item.isActive = res.data.isActive;
              return item;
            }
            return item;
          });
        },
        error: (err) => {
          this.snackbarService.openSnackbar(err.error.error.message);
          e.source.toggle();
        },
      });
  }
}
