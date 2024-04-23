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

export interface Amenity {
  _id: string;
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-amenity',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatIconModule, MatCardModule,MatSlideToggleModule, SharedModule,],
  templateUrl: './amenity.component.html',
  styleUrl: './amenity.component.css'
})
export class AmenityComponent {

  http = inject(HttpClient);
  matDialog = inject(MatDialog);

  displayedColumns: string[] = ['image', 'name','actions'];
  amenities: Amenity[] = [];

  ngOnInit(): void {
    this.http
      .get<{ data: Amenity[] }>(environment.baseUrl + '/amenities')
      .subscribe((res) => {
        this.amenities = res.data;
      });
  }

  openAddAmenityDialog() {
    this.matDialog
    .open(AddAmenityFormComponent, { panelClass: 'rounded-full' })
    .afterClosed()
    .subscribe((result) => {
      console.log(result.get('image'));

      this.http.post(environment.baseUrl + '/amenities', result).subscribe((result) => console.log(result));
    });
  }
}
