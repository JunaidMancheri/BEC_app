import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Category } from '../../categoy/categoy.component';
import { Course } from '../../course/course.component';
import { environment } from '../../../environments/environment';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Amenity } from '../../amenity/amenity.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
  ],
  templateUrl: './post-form.component.html',
  styles: ``,
})
export class PostFormComponent {
  http = inject(HttpClient);
  matDialogRef = inject(MatDialogRef);

  separatorKeysCodes: number[] = [ENTER, COMMA];

  categories: Category[] = [];
  courses: Course[] = [];
  amenities: Amenity[] = [];

  filteredCategories: Category[] = [];
  filteredCourses: Course[] = [];
  filteredAmenities: Amenity[] = [];

  coursesSelected: Course[] = [];
  amenitiesSelected: Amenity[] = [];

  form = new FormGroup({
    category: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    courses: new FormControl([] as string[], Validators.required),
    amenities: new FormControl([] as string[], Validators.required),
  });

  ngOnInit() {
    this.http
      .get<{ data: Course[] }>(environment.baseUrl + '/courses/')
      .subscribe(
        (res) => (
          (this.courses = res.data), (this.filteredCourses = this.courses)
        )
      );

    this.http
      .get<{ data: Category[] }>(environment.baseUrl + '/categories')
      .subscribe(
        (res) => (
          (this.categories = res.data),
          (this.filteredCategories = this.categories)
        )
      );

    this.http
      .get<{ data: Amenity[] }>(environment.baseUrl + '/amenities')
      .subscribe((res) => {
        this.amenities = res.data;
        this.filteredAmenities = this.amenities;
      });
  }

  removeCourse(id: string) {
   this.coursesSelected =  this.coursesSelected.filter((item) => item._id !== id);
    this.form.controls.courses.setValue(
      this.form.controls.courses.value!.filter((item) => item !== id)
    );
  }

  
  removeAmenity(id: string) {
    this.amenitiesSelected =  this.amenitiesSelected.filter((item) => item._id !== id);
     this.form.controls.amenities.setValue(
       this.form.controls.amenities.value!.filter((item) => item !== id)
     );
   }
 

  onCategorySelected(e: MatAutocompleteSelectedEvent) {
    this.form.controls.category.setValue(e.option.value._id);
  }

  onAmenitySelected(e: MatAutocompleteSelectedEvent) {
    this.amenitiesSelected.push(e.option.value);
    const prevValue = this.form.controls.amenities.value
      ? this.form.controls.amenities.value
      : [];
    this.form.controls.amenities.setValue([...prevValue, e.option.value._id]);
  }

  onCourseSelected(e: MatAutocompleteSelectedEvent) {
    this.coursesSelected.push(e.option.value);
    const prevValue = this.form.controls.courses.value
      ? this.form.controls.courses.value
      : [];
    this.form.controls.courses.setValue([...prevValue, e.option.value._id]);
  }

  categoryDisplayFn(category: Category) {
    return category && category.name;
  }

  courseDisplayFn(course: Course) {
    return course && course.name;
  }


  amenityDisplayFn(amenity: Amenity) {
    return amenity && amenity.name;
  }

  onCategoryInputChange(event: Event) {
    const target = event?.target as HTMLInputElement;
    if (target.value) {
      const filterValue = target.value.toLowerCase();
      return (this.filteredCategories = this.categories.filter((item) =>
        item.name.toLowerCase().includes(filterValue)
      ));
    }
    return (this.filteredCategories = this.categories);
  }

  onCourseInputChange(event: Event) {
    const target = event?.target as HTMLInputElement;
    if (target.value) {
      const filterValue = target.value.toLowerCase();
      return (this.filteredCourses = this.courses.filter((item) =>
        item.name.toLowerCase().includes(filterValue)
      ));
    }
    return (this.filteredCourses = this.courses);
  }


  onAmenityInputChange(event: Event) {
    const target = event?.target as HTMLInputElement;
    if (target.value) {
      const filterValue = target.value.toLowerCase();
      return (this.filteredAmenities = this.amenities.filter((item) =>
        item.name.toLowerCase().includes(filterValue)
      ));
    }
    return (this.filteredAmenities = this.amenities);
  }

  onSubmit() {
    console.log(this.form.controls.category.errors);
    console.log(this.form.value);
  }

  onClose() {
    this.matDialogRef.close();
  }
}
