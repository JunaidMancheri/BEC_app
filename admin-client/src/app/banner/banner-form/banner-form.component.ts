import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SnackbarService } from '../../shared/snackbar.service';
import { environment } from '../../../environments/environment';
import { Banner } from '../banner.component';

@Component({
  selector: 'app-banner-form',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  template: `
    <form
      (ngSubmit)="onSubmit(form)"
      #form="ngForm"
      class="flex w-[40vw] flex-col p-7"
    >
      <h1 class="mat-headline-5">@if(data) { Edit } @else { Add } Banner</h1>
      <mat-form-field appearance="outline">
        <mat-label>Title</mat-label>
        <input
          [ngModel]="data ? data.title : null"
          required
          name="title"
          matInput
          placeholder="Ex. Colleges"
        />
        <mat-error>title is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Link</mat-label>
        <input
          [ngModel]="data ? data.link : null"
          required
          name="link"
          matInput
          placeholder="Ex. Colleges"
        />
        <mat-error>link is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Description </mat-label>
        <textarea
          [ngModel]="data ? data.description : null"
          required
          name="description"
          matInput
        ></textarea>
        <mat-error>description is required</mat-error>
      </mat-form-field>

      <label for="file" class="mat-subtitle-1">Banner image:</label>
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
export class BannerFormComponent {
  data = inject(MAT_DIALOG_DATA);
  matDialogRef = inject(MatDialogRef);
  http = inject(HttpClient);
  snackbarService = inject(SnackbarService);

  selectedFile: File | null = null;

  onClose() {
    this.matDialogRef.close();
  }

  onFileSelected(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) this.selectedFile = target.files[0];
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const formData = new FormData();
      formData.append('title', form.value.title);
      formData.append('description', form.value.description);
      formData.append('link', form.value.link);
      if (this.selectedFile) formData.append('image', this.selectedFile);
      if (this.data) {
      } else {
        if (!this.selectedFile)
          return this.snackbarService.openSnackbar('Banner image is required');
        this.http
          .post<{ data: Banner }>(environment.baseUrl + '/banners', formData)
          .subscribe((res) => this.matDialogRef.close(res.data));
      }
    }
  }
}
