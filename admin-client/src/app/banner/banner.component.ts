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
  snackbarService  = inject(SnackbarService);

  ngOnInit(): void {
    this.http
      .get<{ data: Banner[] }>(environment.baseUrl + '/banners')
      .subscribe((res) => {
        this.banners = res.data;
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
