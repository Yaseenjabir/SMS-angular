import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import examsData from '../../data/exams.json';
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

interface ExamType {
  id: number;
  name: string;
  class: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  totalMarks: number;
  teacher: string;
  room: string;
  status: string;
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
  ],
  templateUrl: './exams.html',
  styleUrl: './exams.css',
})
export class Exams {
  searchTerm = '';
  statusFilter = 'all';
  examsData: ExamType[] = examsData;

  // Computed properties for stats to avoid complex template expressions
  get upcomingExamsCount(): number {
    return this.examsData.filter((e) => e.status === 'Upcoming').length;
  }

  get completedExamsCount(): number {
    return this.examsData.filter((e) => e.status === 'Completed').length;
  }

  get totalExamsCount(): number {
    return this.examsData.length;
  }

  // Filter exams based on search and status - reactive getter
  get filteredExams(): ExamType[] {
    return this.examsData.filter((exam) => {
      const matchesSearch =
        exam.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        exam.class.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus =
        this.statusFilter === 'all' || exam.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  // Sort exams by date - reactive getter
  get sortedExams(): ExamType[] {
    return this.filteredExams.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-primary text-primary-foreground';
      case 'Completed':
        return 'bg-success text-success-foreground';
      case 'Ongoing':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  formatTime = (timeString: string) => {
    return timeString;
  };
}
