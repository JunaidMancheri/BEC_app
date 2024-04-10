import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Category {
 _id: string,
 name: string,
 isActive: boolean,
 imageUrl: string;
}

@Component({
  selector: 'app-categoy',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatSlideToggleModule],
  templateUrl: './categoy.component.html',
  styleUrl: './categoy.component.css'
})
export class CategoyComponent implements OnInit {
  http = inject(HttpClient);

  displayedColumns: string[] = ['image', 'name', 'status', 'actions'];
  dataSource: Category[] = [];

  ngOnInit(): void {
      this.http.get<{data: Category[]}>(environment.baseUrl + '/categories').subscribe((res) => {
        this.dataSource = res.data;

      })
  }

}
