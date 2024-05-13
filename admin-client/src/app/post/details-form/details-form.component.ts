import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Amenity } from '../../amenity/amenity.component';
import { environment } from '../../../environments/environment';
import { Category } from '../../categoy/categoy.component';
import { Course } from '../../course/course.component';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-details-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './details-form.component.html',
})
export class DetailsFormComponent {

  @Output() submitDetailsEventEmitter = new EventEmitter();

  
  @Input() formData: FormData | null = null;
  http = inject(HttpClient);

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
    contactNo: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    courses: new FormControl([] as string[], Validators.required),
    amenities: new FormControl([] as string[], Validators.required),
  });


  submitDetails() {
    if (this.form.valid) {
      this.formData?.append('category', this.form.value.category!)
      this.formData?.append('title', this.form.value.title!)
      this.formData?.append('contactNumber', this.form.value.contactNo!)
      this.formData?.append('description', this.form.value.description!)
      this.form.value.courses?.forEach(course => this.formData?.append('courses[]', course))
      this.form.value.amenities?.forEach(amenity => this.formData?.append('amenities[]', amenity))
      this.submitDetailsEventEmitter.emit(this.formData);
    }
  }



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
    this.coursesSelected = this.coursesSelected.filter(
      (item) => item._id !== id
    );
    this.form.controls.courses.setValue(
      this.form.controls.courses.value!.filter((item) => item !== id)
    );
  }

  removeAmenity(id: string) {
    this.amenitiesSelected = this.amenitiesSelected.filter(
      (item) => item._id !== id
    );
    this.form.controls.amenities.setValue(
      this.form.controls.amenities.value!.filter((item) => item !== id)
    );
  }

  onCategorySelected(e: MatAutocompleteSelectedEvent) {
    this.form.controls.category.setValue(e.option.value._id);
  }

  onAmenitySelected(e: MatAutocompleteSelectedEvent) {
    this.amenitiesSelected = Array.from(
      new Set([...this.amenitiesSelected, e.option.value])
    );
    const prevValue = this.form.controls.amenities.value
      ? this.form.controls.amenities.value
      : [];
    this.form.controls.amenities.setValue(
      Array.from(new Set([...prevValue, e.option.value._id]))
    );
  }

  onCourseSelected(e: MatAutocompleteSelectedEvent) {
    this.coursesSelected = Array.from(
      new Set([...this.coursesSelected, e.option.value])
    );
    const prevValue = this.form.controls.courses.value
      ? this.form.controls.courses.value
      : [];
    this.form.controls.courses.setValue(
      Array.from(new Set([...prevValue, e.option.value._id]))
    );
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

  onCancel() {}

}
