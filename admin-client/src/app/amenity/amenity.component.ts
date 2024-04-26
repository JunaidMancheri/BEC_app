import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SharedModule } from '../shared/shared.module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { MatCardModule } from '@angular/material/card';
import { AddAmenityFormComponent } from './add-amenity-form/add-amenity-form.component';
import { SnackbarService } from '../shared/snackbar.service';

export interface Amenity {
  _id: string;
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-amenity',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    SharedModule,
  ],
  templateUrl: './amenity.component.html',
  styleUrl: './amenity.component.css',
})
export class AmenityComponent {
  http = inject(HttpClient);
  matDialog = inject(MatDialog);
  snackbarService = inject(SnackbarService);

  displayedColumns: string[] = ['image', 'name', 'actions'];
  amenities: Amenity[] = [];

  ngOnInit(): void {
    this.http
      .get<{ data: Amenity[] }>(environment.baseUrl + '/amenities')
      .subscribe((res) => {
        this.amenities = res.data;
      });
  }

  deleteAmenity(id: string) {
    this.http.delete(environment.baseUrl + '/amenities/' + id).subscribe(() => {
      this.amenities = this.amenities.filter((item) => item._id !== id);
      this.snackbarService.openSnackbar('Amenity deleted successfully');
    });
  }

  editAmenity(id: string, name: string) {
    this.matDialog
      .open(AddAmenityFormComponent, {
        data: { name, id },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.amenities = this.amenities.map((item) => {
            if (item._id == res._id) {
              return res;
            }
            return item;
          });
        }
      });
  }

  openAddAmenityDialog() {
    this.matDialog
      .open(AddAmenityFormComponent, {
        panelClass: 'rounded-full',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.amenities = [...this.amenities, result];
      });
  }
}
