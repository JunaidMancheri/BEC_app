import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from '../shared/shared.module';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

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
  imports: [MatCardModule, MatIconModule, MatMenuModule, MatButtonModule, SharedModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {

  banners: Banner[] = []
  http = inject(HttpClient)

  ngOnInit(): void {
    this.http
      .get<{ data: Banner[] }>(environment.baseUrl + '/banners')
      .subscribe((res) => {
        this.banners = res.data;
      });
  }

  openAddBannerDialog() {}

}
