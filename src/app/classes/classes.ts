import { Component, OnInit } from '@angular/core';
import classesData from '../../data/classes.json';
import { CommonModule } from '@angular/common';
import {
  HlmCardDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
  HlmCardContentDirective,
} from '@spartan-ng/helm/card';
import { HlmBadgeDirective } from '@spartan-ng/helm/badge';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
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
import {
  HlmTabsComponent,
  HlmTabsListComponent,
  HlmTabsTriggerDirective,
  HlmTabsContentDirective,
} from '@spartan-ng/helm/tabs';
import { ClassesWizard } from './classes-wizard/classes-wizard';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { GET_ALL_CLASSES } from '../../utils/apiPaths';

interface ClassType {
  _id: string;
  name: string;
  grade: number;
  section: string;
  teacher: string;
  totalStudents: number;
  subjects: string[];
  room: string;
  weeklySchedule: { [key: string]: string[] };
}

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [
    CommonModule,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardContentDirective,
    HlmBadgeDirective,
    HlmButtonDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    ClassesWizard,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    HlmTabsComponent,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    HlmTabsContentDirective,
    HlmDialogFooterComponent,
  ],
  templateUrl: './classes.html',
  styleUrl: './classes.css',
})
export class Classes implements OnInit {
  classesData: ClassType[] | null = null;
  selectedClass: ClassType | null = null;
  daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  constructor(private readonly http: HttpClient) {}

  classesDropdown: any;

  ngOnInit(): void {
    // API call on page load
    this.http.get(`${environment.apiUrl}${GET_ALL_CLASSES}`).subscribe({
      next: (response: any) => {
        this.classesData = response.data;
      },
      error: (err) => {
        console.error('Error fetching classes:', err);
      },
    });
  }

  setSelectedClass(classIs: ClassType) {
    this.selectedClass = classIs;
    console.log(this.selectedClass);
  }

  calculateLessonDuration(
    openingTime: string,
    closingTime: string,
    breakMinutes: number,
    totalLessons: number
  ): number {
    function timeToMinutes(timeStr: string) {
      const isAM = timeStr.toUpperCase().includes('AM');
      const isPM = timeStr.toUpperCase().includes('PM');
      let [hour, minute] = timeStr
        .replace(/AM|PM/i, '')
        .trim()
        .split(':')
        .map(Number);

      if (!minute) minute = 0;
      if (isPM && hour !== 12) hour += 12;
      if (isAM && hour === 12) hour = 0;

      return hour * 60 + minute;
    }

    const startMinutes = timeToMinutes(openingTime);
    const endMinutes = timeToMinutes(closingTime);

    const totalMinutes = endMinutes - startMinutes;
    const teachingMinutes = totalMinutes - breakMinutes;
    const lessonDuration = teachingMinutes / totalLessons;

    // Round to nearest 5 minutes
    return Math.round(lessonDuration / 5) * 5;
  }

  sections: Record<'R' | 'G' | 'B', string> = {
    R: 'Red',
    G: 'Green',
    B: 'Blue',
  };

  getSectionName(section: string) {
    return this.sections[section as 'R' | 'G' | 'B'];
  }

  onClassCreated(newClass: ClassType) {
    if (this.classesData) {
      this.classesData = [...this.classesData, newClass]; // Create new array for change detection
    } else {
      this.classesData = [newClass];
    }
  }
}
