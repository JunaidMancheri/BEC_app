import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../environments/environment';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

export interface GeneralDetails {
  email_1: string;
  email_2: string;
  phoneNo_1: string;
  phoneNo_2: string;
}

@Component({
  selector: 'app-general-details',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './general-details.component.html',
  styleUrl: './general-details.component.css',
})
export class GeneralDetailsComponent implements OnInit {
  http = inject(HttpClient);
  editMode = false;

  detailsForm = new FormGroup({
    email_1: new FormControl('', { validators: [Validators.required] }),
    email_2: new FormControl('', { validators: [Validators.required] }),
    phoneNo_1: new FormControl('', { validators: [Validators.required] }),
    phoneNo_2: new FormControl('', { validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.http
      .get<{ data: GeneralDetails }>(environment.baseUrl + '/general-details')
      .subscribe((res) => {
        this.detailsForm.disable();
        this.detailsForm.setValue({
          email_1: res.data.email_1,
          email_2: res.data.email_2,
          phoneNo_1: res.data.phoneNo_1,
          phoneNo_2: res.data.phoneNo_2,
        });
      });
  }

  saveDetails() {
    this.http
      .put(environment.baseUrl + '/general-details', this.detailsForm.value)
      .subscribe(() => (this.detailsForm.disable(), (this.editMode = false)));
  }

  enableEditMode() {
    this.editMode = true;
    this.detailsForm.enable();
  }
}
