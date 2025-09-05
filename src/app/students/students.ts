import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { AppService } from '../app-service';
import { StudentForm } from './student-form/student-form';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
} from '@spartan-ng/helm/dialog';
import {
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/brain/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { GET_ALL_STUDENTS } from '../../utils/apiPaths';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-students',
  imports: [
    HlmDialogComponent,
    HlmDialogContentComponent,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    FormsModule,
    CommonModule,
    HlmButtonDirective,
    StudentForm,
  ],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students implements OnInit {
  searchTerm = '';
  classFilter = 'all';
  studentsData: any[] = []; // will now come from API
  isLoading = true;

  constructor(
    private readonly appService: AppService,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchStudents();
  }

  fetchStudents() {
    this.isLoading = true;
    this.http.get<any[]>(`${environment.apiUrl}${GET_ALL_STUDENTS}`).subscribe({
      next: (res) => {
        this.studentsData = res;
        this.isLoading = false;
      },
      error: (ex) => {
        toast.error(ex.error?.message || 'Failed to fetch students');
        this.isLoading = false;
      },
    });
  }

  // Filtered students based on search + class
  get filteredStudents() {
    return this.studentsData.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.rollNo.toString().includes(this.searchTerm);
      const matchesClass =
        this.classFilter === 'all' ||
        student.grade.toString() === this.classFilter;
      return matchesSearch && matchesClass;
    });
  }

  // Unique grades (instead of classes)
  get uniqueClasses() {
    return [...new Set(this.studentsData.map((s: any) => s.grade.toString()))];
  }
}
