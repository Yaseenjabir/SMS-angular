import { Component } from '@angular/core';
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

interface ClassType {
  id: number;
  name: string;
  grade: string;
  section: string;
  classTeacher: string;
  totalStudents: number;
  subjects: string[];
  room: string;
  schedule: { [key: string]: string[] };
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
export class Classes {
  selectedClass: ClassType | null = null;
  setSelectedClass(classIs: any) {
    this.selectedClass = classIs;
  }
  classesData: ClassType[] = classesData;
  daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
}
