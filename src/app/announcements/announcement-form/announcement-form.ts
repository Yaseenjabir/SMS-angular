import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HlmToasterComponent } from '@spartan-ng/helm/sonner';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CREATE_ANNOUNCEMENT } from '../../../utils/apiPaths';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-announcement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmToasterComponent],
  templateUrl: './announcement-form.html',
  styles: [],
})
export class AnnouncementForm implements OnInit {
  announcementForm!: FormGroup;
  isSubmitting = false;

  audiences = [
    {
      value: 'parent',
      label: 'Parents',
      description: 'Send to all parents/guardians',
      icon: '<svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>',
    },
    {
      value: 'teacher',
      label: 'Teachers',
      description: 'Send to all teaching staff',
      icon: '<svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path></svg>',
    },
    {
      value: 'student',
      label: 'Students',
      description: 'Send to all students',
      icon: '<svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>',
    },
    {
      value: 'all',
      label: 'Everyone',
      description: 'Send to all users (parents, teachers, students)',
      icon: '<svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path><path d="M6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>',
    },
  ];

  priorities = [
    {
      value: 'low',
      label: 'Low Priority',
      description: 'General information, non-urgent',
      icon: '<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>',
    },
    {
      value: 'medium',
      label: 'Medium Priority',
      description: 'Important updates, moderate urgency',
      icon: '<svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>',
    },
    {
      value: 'high',
      label: 'High Priority',
      description: 'Urgent notices, immediate attention required',
      icon: '<svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>',
    },
  ];

  constructor(private fb: FormBuilder, private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.announcementForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      to_whom: ['', Validators.required],
      priority: ['', Validators.required],
      is_active: [false],
    });
  }

  getDescriptionLength(): number {
    return this.announcementForm.get('description')?.value?.length || 0;
  }

  getAudienceIcon(audience: string): string {
    const found = this.audiences.find((a) => a.value === audience);
    return found ? found.icon : '';
  }

  getAudienceLabel(audience: string): string {
    const found = this.audiences.find((a) => a.value === audience);
    return found ? found.label : '';
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  onSubmit(): void {
    if (this.announcementForm.valid) {
      this.isSubmitting = true;

      const submittedData = {
        title: this.announcementForm.get('title')?.value,
        description: this.announcementForm.get('description')?.value,
        to_whom: this.announcementForm.get('to_whom')?.value,
        priority: this.announcementForm.get('priority')?.value,
        is_active: this.announcementForm.get('is_active')?.value,
      };

      this.http
        .post(`${environment.apiUrl}${CREATE_ANNOUNCEMENT}`, submittedData)
        .subscribe({
          next: (res) => {
            if (res) {
              toast.success('Your announcement has been added successfully');
            }
          },
          error: (ex) => {
            if (ex.error.message) {
              toast.error(ex.error.message);
            } else {
              toast.error('Something went wrong');
            }
          },
          complete: () => {
            this.isSubmitting = false;
            this.announcementForm.reset();
            this.announcementForm.get('is_active')?.setValue(false);
          },
        });
    }
  }
}
