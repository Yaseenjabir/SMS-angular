import { Component } from '@angular/core';
import teachersData from '../../data/teachers.json';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmBadgeDirective } from '@spartan-ng/helm/badge';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { FormsModule } from '@angular/forms';
import {
  HlmCardDirective,
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
  HlmCardActionDirective,
} from '@spartan-ng/helm/card';

import {
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/brain/dialog';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/helm/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teachers',
  imports: [
    FormsModule,
    HlmButtonDirective,
    HlmInputDirective,
    HlmButtonDirective,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    CommonModule,
  ],
  templateUrl: './teachers.html',
  styleUrl: './teachers.css',
})
export class Teachers {
  searchTerm = '';
  selectedTeacher: any = null;
  isAddFormOpen = false;
  isEditFormOpen = false;
  editingTeacher: any = null;

  teachersData = teachersData;

  printData() {
    console.log(this.filteredTeachers);
  }

  get filteredTeachers() {
    return this.teachersData.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        teacher.department.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  setSelectedTeacher(teacher: any) {
    console.log(teacher);
    this.selectedTeacher = teacher;
  }
}
