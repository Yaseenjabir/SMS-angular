import { Component, OnInit } from '@angular/core';
import teachersData from '../../data/teachers.json';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { FormsModule } from '@angular/forms';
import { TeacherForm } from './teacher-form/teacher-form';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogHeaderComponent,
} from '@spartan-ng/helm/dialog';
import {
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/brain/dialog';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { GET_ALL_TEACHERS } from '../../utils/apiPaths';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-teachers',
  imports: [
    CommonModule,
    TeacherForm,
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
export class Teachers implements OnInit {
  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}${GET_ALL_TEACHERS}`).subscribe({
      next: (data: any) => {
        this.teachersData = data;
      },
      error: (ex) => {
        toast.error(ex.message);
      },
    });
  }

  somevar = 'HElo worldd';

  searchTerm = '';
  selectedTeacher: any = null;
  isAddFormOpen = false;
  isEditFormOpen = false;
  editingTeacher: any = null;

  teachersData: any[] = [];

  get filteredTeachers() {
    return this.teachersData.filter(
      (teacher: any) =>
        teacher.personalInfo.fullName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        teacher.professionalInfo.subject
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        teacher.professionalInfo.department
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
    );
  }

  setSelectedTeacher(teacher: any) {
    console.log(teacher);
    this.selectedTeacher = teacher;
  }
}
