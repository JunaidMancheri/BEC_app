import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from '../shared/shared.module';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { BannerFormComponent } from './banner-form/banner-form.component';
import { SnackbarService } from '../shared/snackbar.service';

export interface Banner {
  _id: string;
  imageUrl: string;
  title: string;
  description: string;
  isActive: boolean;
  link: string;
}

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    SharedModule,
  ],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
})
export class BannerComponent {
  banners: Banner[] = [];
  http = inject(HttpClient);
  matDialog = inject(MatDialog);
  snackbarService = inject(SnackbarService);

  ngOnInit(): void {
    this.http
      .get<{ data: Banner[] }>(environment.baseUrl + '/banners')
      .subscribe((res) => {
        this.banners = res.data;
      });
  }

  toggleStatus(id: string) {
    this.http
      .patch<{ data: Banner }>(
        environment.baseUrl + '/banners/' + id + '/toggle-status',
        {}
      )
      .subscribe((res) => {
        const updateIndex = this.banners.findIndex((item) => item._id === id);
        this.banners[updateIndex].isActive = res.data.isActive;
        if (res.data.isActive) {
          this.snackbarService.openSnackbar('Banner listed successfully');
        } else {
          this.snackbarService.openSnackbar('Banner unlisted successfully');
        }
      });
  }

  editBanner(banner: Banner) {
    this.matDialog
      .open(BannerFormComponent, { disableClose: true, data: banner })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const updateIndex = this.banners.findIndex(
            (item) => item._id === banner._id
          );
          this.banners[updateIndex] = res;
          this.snackbarService.openSnackbar('Updated banner successfully');
        }
      });
  }

  deleteBanner(id: string) {
    this.http.delete(environment.baseUrl + '/banners/' + id).subscribe(() => {
      this.banners = this.banners.filter((item) => item._id !== id);
      this.snackbarService.openSnackbar('Banner deleted successfully');
    });
  }

  openAddBannerDialog() {
    this.matDialog
      .open(BannerFormComponent, { disableClose: true })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.banners.push(res);
          this.snackbarService.openSnackbar('Added new banner successfully');
        }
      });
  }
}
