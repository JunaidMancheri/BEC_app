import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

export interface Enquiry {
  _id: string;
  post?: String;
  course?: string;
  name: string;
  email: string;
  phoneNo: string;
  city?: string;
  note?: string;
  type: String;
}

@Component({
  selector: 'app-enquiry',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './enquiry.component.html',
  styleUrl: './enquiry.component.css',
})
export class EnquiryComponent implements OnInit {
  http = inject(HttpClient);
  matDialog = inject(MatDialog);

  displayedColumns: string[] = [
    'name',
    'email',
    'phoneNo',
    'city',
    'note',
    'type',
    'post',
    'course',
    'actions',
  ];
  dataSource: Enquiry[] = [];

  ngOnInit(): void {
    this.http
      .get<{ data: Enquiry[] }>(environment.baseUrl + '/enquiries')
      .subscribe((res) => {
        console.log(res.data);
        this.dataSource = res.data;
      });
  }

  deleteEnquiry(id: string) {
    this.http
      .delete(environment.baseUrl + '/enquiries/' + id)
      .subscribe((res) => {
        this.dataSource = this.dataSource.filter((item) => item._id !== id);
      });
  }
}
