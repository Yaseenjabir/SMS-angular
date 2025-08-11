// File: student-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface Student {
  id?: number;
  name: string;
  age: number;
  rollNo: string;
  grade: number;
  section: string;
}

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form.html',
  styleUrls: ['./student-form.css'],
})
export class StudentForm implements OnInit {
  studentForm: FormGroup;
  showSectionDropdown = false;

  // Static data
  grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  sections = ['Green', 'Blue', 'Red'];

  constructor(private fb: FormBuilder) {
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
      const studentData: Student = this.studentForm.value;

      // TODO: Replace with actual API call
      console.log('Student data to be submitted:', studentData);

      // Show success message
      alert(
        `✅ Student "${
          studentData.name
        }" has been added successfully!\n\nClass: ${this.getSelectedGradeSection()}\nRoll No: ${
          studentData.rollNo
        }`
      );

      // Reset form after successful submission
      this.onReset();
    } else {
      // Mark all fields as touched to show validation errors
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
