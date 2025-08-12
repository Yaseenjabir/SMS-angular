import { Component } from '@angular/core';
import studentsData from '../../data/students.json';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { AppService } from '../app-service';
import { StudentForm } from './student-form/student-form';
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
@Component({
  selector: 'app-students',
  imports: [
    HlmDialogComponent,
    HlmDialogContentComponent,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    FormsModule,
    NgClass,
    CommonModule,
    HlmButtonDirective,
    StudentForm,
  ],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students {
  searchTerm = '';
  classFilter = 'all';
  selectedStudent: any = null;
  isAddFormOpen = false;
  isEditFormOpen = false;
  editingStudent: any = null;

  open() {
    this.appService.open();
  }

  close() {
    this.appService.close();
  }

  constructor(private readonly appService: AppService) {}

  // Data
  studentsData = studentsData;

  // Getter for filtered students
  get filteredStudents() {
    return this.studentsData.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.rollNo.includes(this.searchTerm);
      const matchesClass =
        this.classFilter === 'all' || student.class === this.classFilter;
      return matchesSearch && matchesClass;
    });
  }

  // Getter for unique classes
  get uniqueClasses() {
    return [...new Set(this.studentsData.map((s: any) => s.class))];
  }
}
