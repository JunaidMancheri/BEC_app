import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../../../environments/environment';
import { Course } from '../course.component';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
  ],
  template: `
    <form
      (ngSubmit)="onSubmit(form)"
      #form="ngForm"
      class="flex w-[40vw] flex-col p-7"
    >
      <h1 class="mat-headline-5">@if(data) { Edit } @else { Add } Course</h1>
      <mat-form-field appearance="outline">
        <mat-label>Course name</mat-label>
        <input
          [ngModel]="data ? data.name : null"
          required
          name="name"
          matInput
          placeholder="Ex. Colleges"
        />
        <mat-error>name is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label> description </mat-label>
        <textarea
          [ngModel]="data ? data.description : null"
          required
          name="description"
          matInput
        ></textarea>
        <mat-error>description is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Type</mat-label>
        <mat-select [ngModel]="data ? data.type : null" required name="type">
          <mat-option value="undergraduate">Undergraduate</mat-option>
          <mat-option value="postgraduate">Postgraduate</mat-option>
        </mat-select>
        <mat-error>Type is required</mat-error>
      </mat-form-field>

      <div class="duration flex justify-between">
        <mat-form-field appearance="outline" class="w-[49%]">
          <mat-label> Years </mat-label>
          <input
            [ngModel]="data ? data.duration.years : null"
            required
            name="years"
            type="number"
            matInput
            placeholder="Ex. Colleges"
          />
          <mat-error>Years is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-[49%]">
          <mat-label>Months</mat-label>
          <mat-select
            [ngModel]="data ? data.duration.months : null"
            required
            name="months"
          >
            <mat-option [value]="0">0</mat-option>
            <mat-option [value]="1">1</mat-option>
            <mat-option [value]="2">2</mat-option>
            <mat-option [value]="3">3</mat-option>
            <mat-option [value]="4">4</mat-option>
            <mat-option [value]="5">5</mat-option>
            <mat-option [value]="6">6</mat-option>
            <mat-option [value]="7">7</mat-option>
            <mat-option [value]="8">8</mat-option>
            <mat-option [value]="9">9</mat-option>
            <mat-option [value]="10">10</mat-option>
            <mat-option [value]="11">11</mat-option>
            <mat-option [value]="12">12</mat-option>
          </mat-select>
          <mat-error>Months is required</mat-error>
        </mat-form-field>
      </div>

      <button mat-raised-button class="mt-4" color="primary" type="submit">
        @if(data) { Edit } @else { Create }
      </button>

      <button mat-stroked-button (click)="onClose()" class="mt-4" type="button">
        Cancel
      </button>
    </form>
  `,
})
export class CourseFormComponent {
  data = inject(MAT_DIALOG_DATA);
  matDialogRef = inject(MatDialogRef);
  http = inject(HttpClient);

  onClose() {
    this.matDialogRef.close();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.data) {
        this.http.put<{ data: Course }>(
          environment.baseUrl + '/courses/' + this.data._id,
          {
            name: form.value.name,
            description: form.value.description,
            type: form.value.type,
            years: form.value.years,
            months: form.value.months,
          }
        ).subscribe((res) => this.matDialogRef.close(res.data));
      } else {
        this.http
          .post<{ data: Course }>(environment.baseUrl + '/courses', {
            name: form.value.name,
            description: form.value.description,
            type: form.value.type,
            years: form.value.years,
            months: form.value.months,
          })
          .subscribe((res) => this.matDialogRef.close(res.data));
      }
    }
  }
}
