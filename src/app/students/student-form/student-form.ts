// File: student-form.component.ts
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
import { CREATE_STUDENT } from '../../../utils/apiPaths';
import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '@spartan-ng/helm/sonner';

interface Student {
  id?: number;
  name: string;
  age: number;
  rollNo: number;
  grade: number;
  section: string;
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
  showSectionDropdown = false;

  // Static data
  grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  sections = [
    { name: 'Green', value: 'G' },
    { name: 'Blue', value: 'B' },
    { name: 'Red', value: 'R' },
  ];

  constructor(private fb: FormBuilder, private readonly http: HttpClient) {
    this.studentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(5), Validators.max(20)]],
      rollNo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      grade: ['', Validators.required],
      section: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Watch for grade changes to show/hide section dropdown
    this.studentForm.get('grade')?.valueChanges.subscribe((value) => {
      this.showSectionDropdown = !!value;
      if (!value) {
        // Reset section when grade is cleared
        this.studentForm.get('section')?.setValue('');
      }
    });
  }

  onGradeChange() {
    // Additional logic when grade changes if needed
    const gradeValue = this.studentForm.get('grade')?.value;
    if (gradeValue) {
      this.showSectionDropdown = true;
      // Reset section selection when grade changes
      this.studentForm.get('section')?.setValue('');
    } else {
      this.showSectionDropdown = false;
    }
  }

  getSelectedGradeSection(): string {
    const grade = this.studentForm.get('grade')?.value;
    const section = this.studentForm.get('section')?.value;

    if (grade && section) {
      return `Grade ${grade}, Section ${section}`;
    }
    return '';
  }

  getFormValues(): Student | null {
    if (this.studentForm.valid) {
      return this.studentForm.value as Student;
    }
    return null;
  }

  controlHasError(controlName: string, errorType: string): boolean {
    const control = this.studentForm.get(controlName);
    return !!(control && control.touched && control.hasError(errorType));
  }

  onSubmit() {
    if (this.studentForm.valid) {
      let studentData: Student = this.studentForm.value;
      studentData = {
        ...studentData,
        age: Number(studentData.age),
        grade: Number(studentData.grade),
        rollNo: Number(studentData.rollNo),
      };

      this.http
        .post(`${environment.apiUrl}${CREATE_STUDENT}`, studentData)
        .subscribe({
          next: (data) => {
            if (data) {
              toast.success('Student added succesfully');
              this.onReset();
            }
          },
          error: (err) => {
            toast.error(err.error.message);
          },
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  onReset() {
    this.studentForm.reset();
    this.showSectionDropdown = false;
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
