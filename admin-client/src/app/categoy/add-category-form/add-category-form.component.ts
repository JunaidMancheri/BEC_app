import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-category-form',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  template: `
        <form #form="ngForm" (ngSubmit)="onSubmit(form)" class="flex flex-col p-7 ">
        <mat-form-field appearance="outline">
      <mat-label>Category name</mat-label>
       <input ngModel name="name" matInput placeholder="Ex. Colleges">
       <mat-error>name is required</mat-error>
      </mat-form-field>
      <input #file name="image" type="file">
      <button mat-raised-button class="mt-4" color="primary" type="submit" >Create</button>
        </form>
  `,
})
export class AddCategoryFormComponent {
  @ViewChild('file') file!: ElementRef
  matDialogRef = inject(MatDialogRef);
  onSubmit(form: NgForm) {
  const formData = new FormData();
  if (this.file.nativeElement.files)
  formData.append('image', this.file.nativeElement.files[0]);
  formData.append('name', form.value.name)
  this.matDialogRef.close(formData);
  }
}
