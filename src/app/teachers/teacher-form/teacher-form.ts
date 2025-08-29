import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CREATE_TEACHER } from '../../../utils/apiPaths';
import { environment } from '../../../environments/environment.development';
import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '@spartan-ng/helm/sonner';

interface TeachingClass {
  grade: number;
  section: string;
}

interface TeacherData {
  personalInfo: {
    title: string;
    fullName: string;
    phone: string;
    email: string;
    address: string;
  };
  professionalInfo: {
    subject: string;
    department: string;
    qualificationDegree: string;
    qualificationSubject: string;
    experience: number;
    joiningDate: string;
  };
  teachingClasses: TeachingClass[];
}

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HlmToasterComponent,
  ],
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.html',
  styles: [
    `
      .step-active {
        background-color: #2563eb;
      }
      .step-completed {
        background-color: #16a34a;
      }
      .step-inactive {
        background-color: #9ca3af;
      }
    `,
  ],
})
export class TeacherForm implements OnInit, OnChanges {
  @Input() teachersData: any;
  teacherForm: FormGroup;
  currentStep = 1;

  ngOnInit(): void {
    // This might run before teachersData is available
    this.logTeachersData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // This will run whenever teachersData input changes
    if (changes['teachersData'] && changes['teachersData'].currentValue) {
      this.logTeachersData();
    }
  }

  private logTeachersData(): void {
    console.log('Teachers Data:', this.teachersData);
    console.log('Type of teachersData:', typeof this.teachersData);
  }

  // Teaching Classes
  teachingClasses: TeachingClass[] = [];
  selectedGrade: number | null = null;
  selectedSection: string = '';

  // Dropdown options
  grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  experienceYears = Array.from({ length: 30 }, (_, i) => i + 1);

  constructor(
    private formBuilder: FormBuilder,
    private readonly http: HttpClient
  ) {
    this.teacherForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      // Personal Information
      title: ['', Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]{10,}$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],

      // Professional Information
      subject: ['', Validators.required],
      department: ['', Validators.required],
      qualificationDegree: ['', Validators.required],
      qualificationSubject: ['', Validators.required],
      experience: ['', Validators.required],
      joiningDate: ['', Validators.required],
    });
  }

  getStepClass(step: number): string {
    if (step < this.currentStep) {
      return 'bg-green-600'; // Completed
    } else if (step === this.currentStep) {
      return 'bg-blue-600'; // Current
    } else {
      return 'bg-gray-400'; // Inactive
    }
  }

  getSectionColor(section: string): string {
    switch (section) {
      case 'R':
        return 'text-red-600';
      case 'G':
        return 'text-green-600';
      case 'B':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return (
          this.teacherForm.get('title')?.valid! &&
          this.teacherForm.get('fullName')?.valid! &&
          this.teacherForm.get('phone')?.valid! &&
          this.teacherForm.get('email')?.valid! &&
          this.teacherForm.get('address')?.valid!
        );
      case 2:
        return (
          this.teacherForm.get('subject')?.valid! &&
          this.teacherForm.get('department')?.valid! &&
          this.teacherForm.get('qualificationDegree')?.valid! &&
          this.teacherForm.get('qualificationSubject')?.valid! &&
          this.teacherForm.get('experience')?.valid! &&
          this.teacherForm.get('joiningDate')?.valid!
        );
      case 3:
        return this.teachingClasses.length > 0;
      default:
        return false;
    }
  }

  nextStep() {
    if (this.isCurrentStepValid() && this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  addTeachingClass() {
    if (this.selectedGrade && this.selectedSection) {
      // Check if this class already exists
      const exists = this.teachingClasses.some(
        (tc) =>
          tc.grade === this.selectedGrade && tc.section === this.selectedSection
      );

      if (!exists) {
        this.teachingClasses.push({
          grade: Number(this.selectedGrade),
          section: this.selectedSection,
        });

        // Reset selections
        this.selectedGrade = null;
        this.selectedSection = '';
      }
    }
  }

  removeTeachingClass(index: number) {
    this.teachingClasses.splice(index, 1);
  }

  onSubmit() {
    if (this.teacherForm.valid && this.teachingClasses.length > 0) {
      const teacherData: TeacherData = {
        personalInfo: {
          title: this.teacherForm.get('title')?.value,
          fullName: this.teacherForm.get('fullName')?.value,
          phone: this.teacherForm.get('phone')?.value,
          email: this.teacherForm.get('email')?.value,
          address: this.teacherForm.get('address')?.value,
        },
        professionalInfo: {
          subject: this.teacherForm.get('subject')?.value,
          department: this.teacherForm.get('department')?.value,
          qualificationDegree: this.teacherForm.get('qualificationDegree')
            ?.value,
          qualificationSubject: this.teacherForm.get('qualificationSubject')
            ?.value,
          experience: Number(this.teacherForm.get('experience')?.value),
          joiningDate: this.teacherForm.get('joiningDate')?.value,
        },
        teachingClasses: this.teachingClasses,
      };
      this.http
        .post(`${environment.apiUrl}${CREATE_TEACHER}`, teacherData)
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              toast.success('Teacher has been added succesfully.');
              this.resetForm();
            }
          },
          error: (ex) => {
            toast.error(ex.error.message);
          },
        });
    }
  }

  resetForm() {
    this.teacherForm.reset();
    this.teachingClasses = [];
    this.selectedGrade = null;
    this.selectedSection = '';
    this.currentStep = 1;
  }
}
