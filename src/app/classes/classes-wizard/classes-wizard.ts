// File: classes-wizard.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { HlmToasterComponent } from '@spartan-ng/helm/sonner';

import {
  HlmCardDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
  HlmCardContentDirective,
} from '@spartan-ng/helm/card';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmBadgeDirective } from '@spartan-ng/helm/badge';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CREATE_CLASS } from '../../../utils/apiPaths';
import { toast } from 'ngx-sonner';

interface ClassType {
  id?: number;
  grade: number;
  section: string;
  room: number;
  teacher?: string;
  subjects?: string[];
  weeklySchedule?: { [key: string]: string[] };
}

@Component({
  selector: 'app-classes-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmToasterComponent],
  templateUrl: './classes-wizard.html',
  styleUrls: ['./classes-wizard.css'],
})
export class ClassesWizard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private http = inject(HttpClient);

  // Stepper state
  currentStep = 1;
  stepLabels = ['Class Info', 'Staff', 'Schedule', 'Review'];

  // Mock lists (replace with real service calls)
  teacherList = ['Ms. Ayesha', 'Mr. Hamid', 'Ms. Fatima', 'Mr. Ali'];
  subjectsList = [
    'Mathematics',
    'English',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Geography',
  ];
  daysOfWeek = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  // Main reactive form
  form: FormGroup;

  get step1(): FormGroup {
    return this.form.get('step1') as FormGroup;
  }
  get step2(): FormGroup {
    return this.form.get('step2') as FormGroup;
  }
  get step3(): FormGroup {
    return this.form.get('step3') as FormGroup;
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      step1: this.fb.group({
        grade: ['', [Validators.required]],
        section: ['', [Validators.required]],
        room: ['', [Validators.required, Validators.min(1)]],
      }),
      step2: this.fb.group({
        classTeacher: ['', Validators.required],
      }),
      step3: this.fb.group({
        subjects: [[], this.arrayMinLength(1)],
        schedule: this.fb.group({
          monday: [[]],
          tuesday: [[]],
          wednesday: [[]],
          thursday: [[]],
          friday: [[]],
          saturday: [[]],
        }),
      }),
    });
  }

  ngOnInit() {
    this.loadFromSessionStorage();
    this.setupAutoSave();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Session Storage Auto-Save
  setupAutoSave() {
    this.form.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => {
        this.saveToSessionStorage();
      });
  }

  saveToSessionStorage() {
    const formData = {
      formValue: this.form.value,
      currentStep: this.currentStep,
      timestamp: new Date().toISOString(),
    };
    sessionStorage.setItem('classWizardData', JSON.stringify(formData));
  }

  loadFromSessionStorage() {
    const savedData = sessionStorage.getItem('classWizardData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        this.form.patchValue(data.formValue);
        this.currentStep = data.currentStep || 1;
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }

  clearSessionStorage() {
    sessionStorage.removeItem('classWizardData');
  }

  // Custom validator for array minimum length
  arrayMinLength(min: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value && Array.isArray(value) && value.length >= min) {
        return null;
      }
      return {
        arrayMinLength: {
          requiredLength: min,
          actualLength: value ? value.length : 0,
        },
      };
    };
  }

  // Helper methods for UI
  getSelectedSubjects(): string[] {
    return this.step3.get('subjects')!.value || [];
  }

  getSelectedSubjectsCount(): number {
    return this.getSelectedSubjects().length;
  }

  isSubjectSelected(subject: string): boolean {
    return this.getSelectedSubjects().includes(subject);
  }

  isScheduleSubjectSelected(day: string, subject: string): boolean {
    const scheduleGroup = this.step3.get('schedule') as FormGroup;
    const daySubjects = scheduleGroup.get(day)!.value || [];
    return daySubjects.includes(subject);
  }

  getScheduleSubjects(day: string): string[] {
    const scheduleGroup = this.step3.get('schedule') as FormGroup;
    return scheduleGroup.get(day)!.value || [];
  }

  isDayEmpty(day: string): boolean {
    return this.getScheduleSubjects(day).length === 0;
  }

  isScheduleComplete(): boolean {
    return this.daysOfWeek.every((day) => !this.isDayEmpty(day));
  }

  clearAllSchedules() {
    const scheduleGroup = this.step3.get('schedule') as FormGroup;
    this.daysOfWeek.forEach((day) => {
      scheduleGroup.get(day)!.setValue([]);
    });
  }

  // Navigation
  canGoNext(): boolean {
    if (this.currentStep === 1) return this.step1.valid;
    if (this.currentStep === 2) return this.step2.valid;
    if (this.currentStep === 3)
      return this.step3.valid && this.isScheduleComplete();
    return false;
  }

  next() {
    // mark controls touched to show validation errors
    if (this.currentStep === 1) this.markGroupTouched(this.step1);
    if (this.currentStep === 2) this.markGroupTouched(this.step2);
    if (this.currentStep === 3) this.markGroupTouched(this.step3);

    if (!this.canGoNext()) return;
    if (this.currentStep < 4) {
      this.currentStep++;
      this.saveToSessionStorage();
    }
  }

  back() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.saveToSessionStorage();
    }
  }

  goTo(step: number) {
    // allow jumping to a previous step or to the review when all steps valid
    if (step < this.currentStep) {
      this.currentStep = step;
      this.saveToSessionStorage();
      return;
    }
    // trying to jump forward — validate previous steps
    if (step === 2 && this.step1.valid) {
      this.currentStep = 2;
      this.saveToSessionStorage();
      return;
    }
    if (step === 3 && this.step1.valid && this.step2.valid) {
      this.currentStep = 3;
      this.saveToSessionStorage();
      return;
    }
    if (
      step === 4 &&
      this.step1.valid &&
      this.step2.valid &&
      this.step3.valid &&
      this.isScheduleComplete()
    ) {
      this.currentStep = 4;
      this.saveToSessionStorage();
      return;
    }
    // else do nothing — user must complete steps in order
    this.markGroupTouched(this.step1);
    this.markGroupTouched(this.step2);
    this.markGroupTouched(this.step3);
  }

  submit() {
    // final validation
    this.markGroupTouched(this.step1);
    this.markGroupTouched(this.step2);
    this.markGroupTouched(this.step3);

    if (
      !this.step1.valid ||
      !this.step2.valid ||
      !this.step3.valid ||
      !this.isScheduleComplete()
    ) {
      this.currentStep = 1;
      return;
    }

    // build the ClassType object
    const payload: ClassType = {
      grade: Number(this.step1.value.grade),
      section: this.step1.value.section,
      room: this.step1.value.room,
      teacher: this.step2.value.classTeacher,
      subjects: this.step3.value.subjects,
      weeklySchedule: this.step3.value.schedule,
    };

    console.log(payload);
    this.http
      .post<{ data: ClassType; message: string }>(
        `${environment.apiUrl}${CREATE_CLASS}`,
        payload
      )
      .subscribe({
        next: (response) => {
          if (response.data) {
            toast.success('Class added successfully');
            this.clearSessionStorage();
            this.reset();
          }
        },
        error: (err) => {
          const msg = err.error?.message;

          if (Array.isArray(msg)) {
            msg.forEach((element: string) => toast.error(element));
          } else if (typeof msg === 'string') {
            toast.error(msg);
          } else {
            toast.error('An unexpected error occurred');
          }
        },
      });
  }

  reset() {
    this.form.reset({
      step1: { grade: '', section: '', room: '' },
      step2: { classTeacher: '' },
      step3: {
        subjects: [],
        schedule: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
        },
      },
    });
    this.currentStep = 1;
    this.clearSessionStorage();
  }

  // helper to mark all controls touched for a group
  private markGroupTouched(group: AbstractControl) {
    if (!group) return;
    if ((group as FormGroup).controls) {
      Object.values((group as FormGroup).controls).forEach((control) => {
        control.markAsTouched();
        if ((control as FormGroup).controls) this.markGroupTouched(control);
      });
    }
  }

  // Helpers for UI
  controlHasError(control: AbstractControl | null, error: string) {
    if (!control) return false;
    return control.touched && control.hasError(error);
  }

  // Utility to toggle subject in subjects array
  toggleSubject(subject: string) {
    const arr: string[] = this.step3.get('subjects')!.value || [];
    const idx = arr.indexOf(subject);
    if (idx > -1) arr.splice(idx, 1);
    else arr.push(subject);
    this.step3.get('subjects')!.setValue(arr);
    this.step3.get('subjects')!.markAsTouched();
  }

  // Manage schedule: add/remove subject for a day
  toggleScheduleSubject(day: string, subject: string) {
    const scheduleGroup = this.step3.get('schedule') as FormGroup;
    const arr: string[] = scheduleGroup.get(day)!.value || [];
    const idx = arr.indexOf(subject);
    if (idx > -1) arr.splice(idx, 1);
    else arr.push(subject);
    scheduleGroup.get(day)!.setValue(arr);
    scheduleGroup.get(day)!.markAsTouched();
  }
}
