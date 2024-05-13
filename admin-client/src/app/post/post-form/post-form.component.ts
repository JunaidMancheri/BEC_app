import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { DetailsFormComponent } from '../details-form/details-form.component';
import { JsonPipe } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [MatButtonModule, MatStepperModule, DetailsFormComponent, JsonPipe],
  templateUrl: './post-form.component.html',
  styles: ``,
})
export class PostFormComponent {
  @ViewChild(MatStepper) matStepper!: MatStepper;
  http = inject(HttpClient);

  formData = new FormData();

  onDetailsSubmit() {
    this.matStepper.next();
  }

  onCoverImageSelected(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) this.formData.append('coverImage', target.files[0]);
  }

  onGalleryImagesSelected(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      for (let i = 0; i < target.files.length; i++) {
        this.formData.append('gallery', target.files[i]);
      }
    }
  }

  onBrochureSelected(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) this.formData.append('brochureFile', target.files[0]);
  }

  onSubmit() {
    this.http
      .post(environment.baseUrl + '/posts', this.formData)
      .subscribe((res) => console.log(res));
  }

  onClose() {}
}
