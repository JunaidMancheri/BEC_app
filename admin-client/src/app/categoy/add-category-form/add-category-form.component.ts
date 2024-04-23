import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../shared/snackbar.service';
import { HttpClient } from '@angular/common/http';
import { Category } from '../categoy.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-category-form',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  template: `
    <form #form="ngForm" (ngSubmit)="onSubmit(form)" class="flex flex-col p-7 ">
      <mat-form-field appearance="outline">
        <mat-label>Category name</mat-label>
        <input
          [ngModel]="data ? data.name : null"
          required
          name="name"
          matInput
          placeholder="Ex. Colleges"
        />
        <mat-error>name is required</mat-error>
      </mat-form-field>
      <label for="file" class="mb-1">Category image:</label>
      <input
        (change)="onFileSelected($event)"
        #file
        id="file"
        name="image"
        type="file"
      />
      <button mat-raised-button class="mt-4" color="primary" type="submit">
        @if(data) { Edit } @else { Create }
      </button>

      <button mat-stroked-button (click)="onClose()" class="mt-4" type="button">
        Cancel
      </button>
    </form>
  `,
})
export class AddCategoryFormComponent {
  matDialogRef = inject(MatDialogRef);
  snackbarService = inject(SnackbarService);
  http = inject(HttpClient);
  data = inject(MAT_DIALOG_DATA);

  selectedFile: null | File = null;

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) this.selectedFile = target.files[0];
  }

  onClose() {
    this.matDialogRef.close();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const formData = new FormData();
      formData.append('name', form.value.name);
      if (this.selectedFile) formData.append('image', this.selectedFile);
      if (this.data) {
        this.http
          .put<{ data: Category }>(
            environment.baseUrl + '/categories/' + this.data.id,
            formData
          )
          .subscribe({
            next: (res) => this.matDialogRef.close(res.data),
            error: (err) =>
              this.snackbarService.openSnackbar(err.error.error.message),
          });
      } else {
        if (!this.selectedFile) {
          return this.snackbarService.openSnackbar(
            'Please select category image'
          );
        }
        this.http
          .post<{ data: Category }>(
            environment.baseUrl + '/categories',
            formData
          )
          .subscribe({
            next: (res) => this.matDialogRef.close(res.data),
            error: (err) =>
              this.snackbarService.openSnackbar(err.error.error.message),
          });
      }
    }
  }
}
