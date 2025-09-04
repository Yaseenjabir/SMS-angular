// exams.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  HlmCardDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
  HlmCardContentDirective,
} from '@spartan-ng/helm/card';
import { HlmBadgeDirective } from '@spartan-ng/helm/badge';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { ExamForm } from './exam-form/exam-form';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogHeaderComponent,
  HlmDialogFooterComponent,
} from '@spartan-ng/helm/dialog';
import {
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/brain/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { GET_ALL_EXAMS } from '../../utils/apiPaths';
import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '@spartan-ng/helm/sonner';

// Updated interface to match API response
interface ExamType {
  _id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  class_from: number;
  class_to: number;
  status: string;
  date_sheet_image: string;
}

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [
    ExamForm,
    CommonModule,
    FormsModule,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardContentDirective,
    HlmBadgeDirective,
    HlmButtonDirective,
    HlmInputDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    HlmToasterComponent,
  ],
  templateUrl: './exams.html',
  styleUrl: './exams.css',
})
export class Exams implements OnInit {
  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadExams();
  }

  searchTerm = '';
  statusFilter = 'all';
  examsData: ExamType[] = [];
  loading = true;
  selectedExam: ExamType | null = null;
  showImageDialog = false;

  loadExams(): void {
    this.loading = true;
    this.http
      .get<ExamType[]>(`${environment.apiUrl}${GET_ALL_EXAMS}`)
      .subscribe({
        next: (res: any) => {
          if (res.founded) {
            this.examsData = res.exams;
            console.log('Loaded exams:', this.examsData);
          }
          this.loading = false;
        },
        error: (ex) => {
          toast.error(ex.error.message);
          this.loading = false;
        },
      });
  }

  // Computed properties for stats
  get upcomingExamsCount(): number {
    return this.examsData.filter((e) => e.status === 'UPCOMING').length;
  }

  get completedExamsCount(): number {
    return this.examsData.filter((e) => e.status === 'COMPLETED').length;
  }

  get ongoingExamsCount(): number {
    return this.examsData.filter((e) => e.status === 'ONGOING').length;
  }

  get totalExamsCount(): number {
    return this.examsData.length;
  }

  // Filter exams based on search and status
  get filteredExams(): ExamType[] {
    return this.examsData.filter((exam) => {
      const matchesSearch =
        exam.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        exam.description
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        this.getClassRange(exam)
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        this.statusFilter === 'all' || exam.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  // Sort exams by start date
  get sortedExams(): ExamType[] {
    return this.filteredExams.sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
  }

  getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-primary text-primary-foreground';
      case 'COMPLETED':
        return 'bg-success text-success-foreground';
      case 'ONGOING':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  getClassRange = (exam: ExamType): string => {
    if (exam.class_from === exam.class_to) {
      return `Class ${exam.class_from}`;
    }
    return `Class ${exam.class_from}-${exam.class_to}`;
  };

  getDuration = (exam: ExamType): string => {
    const startDate = new Date(exam.start_date);
    const endDate = new Date(exam.end_date);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return '1 day';
    }
    return `${diffDays} days`;
  };

  // Helper method to get display status
  getDisplayStatus = (status: string): string => {
    switch (status) {
      case 'UPCOMING':
        return 'Upcoming';
      case 'COMPLETED':
        return 'Completed';
      case 'ONGOING':
        return 'Ongoing';
      default:
        return status;
    }
  };

  // Open image dialog
  openImageDialog(exam: ExamType): void {
    this.selectedExam = exam;
    this.showImageDialog = true;
    // Trigger the dialog programmatically
    setTimeout(() => {
      const trigger = document.querySelector(
        '#imageDialogTrigger'
      ) as HTMLButtonElement;
      if (trigger) {
        trigger.click();
      }
    }, 0);
  }

  // Close image dialog
  closeImageDialog(): void {
    this.showImageDialog = false;
    this.selectedExam = null;
  }
}
