import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../environments/environment';

export interface GeneralDetails {
  email_1: string;
  email_2: string;
  phoneNo_1: string;
  phoneNo_2: string;
}

@Component({
  selector: 'app-general-details',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './general-details.component.html',
  styleUrl: './general-details.component.css'
})
export class GeneralDetailsComponent implements OnInit {
  http = inject(HttpClient);
  details:GeneralDetails = {} as GeneralDetails
  ngOnInit(): void {
    this.http.get<{data: GeneralDetails}>(environment.baseUrl + '/general-details').subscribe(res => {
          this.details = res.data;
    })
  }


}
