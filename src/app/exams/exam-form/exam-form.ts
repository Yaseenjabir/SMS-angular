import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CREATE_EXAM } from '../../../utils/apiPaths';
import { toast } from 'ngx-sonner';
// import { HlmToaster } from '@spartan-ng/helm/sonner';
import { HlmToasterComponent } from '@spartan-ng/helm/sonner';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmToasterComponent],
  templateUrl: './exam-form.html',
  styles: [],
})
export class ExamForm implements OnInit {
  examForm!: FormGroup;
  classes = Array.from({ length: 12 }, (_, i) => i + 1); // Classes 1-12
  isSubmitting = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder, private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.examForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      class_from: ['', Validators.required],
      class_to: ['', Validators.required],
      date_sheet_image: ['', Validators.required],
      status: ['', Validators.required],
    });

    // Add custom validators
    this.examForm.get('end_date')?.valueChanges.subscribe(() => {
      this.validateEndDate();
    });

    this.examForm.get('start_date')?.valueChanges.subscribe(() => {
      this.validateEndDate();
    });

    this.examForm.get('class_to')?.valueChanges.subscribe(() => {
      this.validateClassRange();
    });

    this.examForm.get('class_from')?.valueChanges.subscribe(() => {
      this.validateClassRange();
      // Reset class_to if it becomes invalid
      const classFrom = this.examForm.get('class_from')?.value;
      const classTo = this.examForm.get('class_to')?.value;
      if (classFrom && classTo && parseInt(classTo) < parseInt(classFrom)) {
        this.examForm.get('class_to')?.setValue('');
      }
    });
  }

  private validateEndDate(): void {
    const startDate = this.examForm.get('start_date')?.value;
    const endDate = this.examForm.get('end_date')?.value;
    const endDateControl = this.examForm.get('end_date');

    if (startDate && endDate) {
      if (new Date(endDate) <= new Date(startDate)) {
        endDateControl?.setErrors({ endDateInvalid: true });
      } else {
        const errors = endDateControl?.errors;
        if (errors) {
          delete errors['endDateInvalid'];
          if (Object.keys(errors).length === 0) {
            endDateControl?.setErrors(null);
          }
        }
      }
    }
  }

  private validateClassRange(): void {
    const classFrom = parseInt(this.examForm.get('class_from')?.value);
    const classTo = parseInt(this.examForm.get('class_to')?.value);
    const classToControl = this.examForm.get('class_to');

    if (classFrom && classTo) {
      if (classTo < classFrom) {
        classToControl?.setErrors({ classRangeInvalid: true });
      } else {
        const errors = classToControl?.errors;
        if (errors) {
          delete errors['classRangeInvalid'];
          if (Object.keys(errors).length === 0) {
            classToControl?.setErrors(null);
          }
        }
      }
    }
  }

  getAvailableToClasses(): number[] {
    const classFrom = parseInt(this.examForm.get('class_from')?.value);
    if (classFrom) {
      return this.classes.filter((c) => c >= classFrom);
    }
    return this.classes;
  }

  getExamDuration(): string {
    const startDate = this.examForm.get('start_date')?.value;
    const endDate = this.examForm.get('end_date')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffMs = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffDays === 1) {
        return `${diffHours} hours`;
      } else {
        return `${diffDays} days`;
      }
    }
    return '';
  }

  getClassCount(): number {
    const classFrom = parseInt(this.examForm.get('class_from')?.value);
    const classTo = parseInt(this.examForm.get('class_to')?.value);

    if (classFrom && classTo) {
      return classTo - classFrom + 1;
    }
    return 0;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800';
      case 'ONGOING':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(png|jpg|jpeg)/)) {
        alert('Please select a valid image file (PNG, JPG, JPEG)');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      this.selectedFile = file;
      this.examForm.get('date_sheet_image')?.setValue(file.name);

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.examForm.get('date_sheet_image')?.setValue('');
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onSubmit(): void {
    if (this.examForm.valid && this.selectedFile) {
      this.isSubmitting = true;

      // Create FormData object
      const formData = new FormData();

      // Add all form fields to FormData
      formData.append('name', this.examForm.get('name')?.value);
      formData.append(
        'description',
        this.examForm.get('description')?.value || ''
      );
      formData.append(
        'start_date',
        new Date(this.examForm.get('start_date')?.value).toISOString()
      );
      formData.append(
        'end_date',
        new Date(this.examForm.get('end_date')?.value).toISOString()
      );
      formData.append(
        'class_from',
        this.examForm.get('class_from')?.value.toString()
      );
      formData.append(
        'class_to',
        this.examForm.get('class_to')?.value.toString()
      );
      formData.append('status', this.examForm.get('status')?.value);

      // Add the image file
      if (this.selectedFile) {
        formData.append(
          'date_sheet_image',
          this.selectedFile,
          this.selectedFile.name
        );
      }

      // console.log('Form data content : ', formData);
      // console.log('FormData contents:');
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      this.http
        .post(`${environment.apiUrl}${CREATE_EXAM}`, formData)
        .subscribe({
          next: (res) => {
            if (res) {
              toast.success('Exam has been added succesfully');
            }
          },
          error: (ex) => {
            if (ex.message) {
              toast.error(ex.message);
            } else {
              toast.error('Internal Server Error');
            }
          },
          complete: () => {
            this.isSubmitting = false;
            this.examForm.reset();
            this.selectedFile = null;
            this.imagePreview = null;
          },
        });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.examForm.controls).forEach((key) => {
        this.examForm.get(key)?.markAsTouched();
      });

      if (!this.selectedFile) {
        this.examForm.get('date_sheet_image')?.markAsTouched();
      }
    }
  }
}
