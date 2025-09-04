import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CREATE_STUDENT, GET_ALL_DROPDOWNS } from '../../../utils/apiPaths';
import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '@spartan-ng/helm/sonner';

interface Student {
  id?: number;
  name: string;
  age: number;
  rollNo: number;
  grade: number;
  section: string;
  dob: string;
  gender: string;
  address: string;
  admissionDate: string;
  class: string;
}

interface GradeSection {
  _id: string;
  grade: number;
  section: string;
  displayText?: string;
}

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmToasterComponent],
  templateUrl: './student-form.html',
  styleUrls: ['./student-form.css'],
})
export class StudentForm implements OnInit {
  studentForm: FormGroup;
  gradeSections: GradeSection[] = [];
  isLoadingDropdowns = false;

  constructor(private fb: FormBuilder, private readonly http: HttpClient) {
    this.studentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(5), Validators.max(20)]],
      rollNo: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(5)]],
      admissionDate: ['', Validators.required],
      class: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getAllDropDowns();
  }

  getAllDropDowns() {
    this.isLoadingDropdowns = true;
    this.http
      .get<GradeSection[]>(`${environment.apiUrl}${GET_ALL_DROPDOWNS}`)
      .subscribe({
        next: (res) => {
          this.gradeSections = res.map((item) => ({
            ...item,
            displayText: `Grade ${item.grade} - Section ${item.section}`,
          }));
          this.isLoadingDropdowns = false;
        },
        error: (ex) => {
          console.error(ex);
          this.isLoadingDropdowns = false;
          toast.error('Failed to load grade and section data');
        },
      });
  }

  getSelectedClass(): string {
    const selectedClassId = this.studentForm.get('class')?.value;
    if (selectedClassId) {
      const selectedClass = this.gradeSections.find(
        (item) => item._id === selectedClassId
      );
      if (selectedClass) {
        return `Grade ${selectedClass.grade}, Section ${selectedClass.section}`;
      }
    }
    return '';
  }

  getFormValues(): any {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.value;
      const selectedClass = this.gradeSections.find(
        (item) => item._id === formValue.class
      );

      return {
        ...formValue,
        grade: selectedClass?.grade,
        section: selectedClass?.section,
        class: formValue.class,
      };
    }
    return null;
  }

  controlHasError(controlName: string, errorType: string): boolean {
    const control = this.studentForm.get(controlName);
    return !!(control && control.touched && control.hasError(errorType));
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.value;
      const selectedClass = this.gradeSections.find(
        (item) => item._id === formValue.class
      );

      let studentData: Student = {
        name: formValue.name,
        age: Number(formValue.age),
        rollNo: Number(formValue.rollNo),
        dob: formValue.dob,
        gender: formValue.gender,
        address: formValue.address,
        admissionDate: formValue.admissionDate,
        grade: selectedClass?.grade || 0,
        section: selectedClass?.section || '',
        class: formValue.class,
      };

      this.http
        .post(`${environment.apiUrl}${CREATE_STUDENT}`, studentData)
        .subscribe({
          next: (data) => {
            if (data) {
              toast.success('Student added successfully');
              this.onReset();
            }
          },
          error: (err) => {
            if (Array.isArray(err.error.message)) {
              err.error.message.forEach((element: string) => {
                toast.error(element);
              });
            } else {
              toast.error(err.error.message);
            }
            console.log('Err is : ', err);
          },
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  onReset() {
    this.studentForm.reset();
  }

  private markFormGroupTouched() {
    Object.keys(this.studentForm.controls).forEach((key) => {
      const control = this.studentForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}
