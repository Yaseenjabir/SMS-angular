import { Component } from '@angular/core';
import studentsData from '../../data/students.json';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-students',
  imports: [FormsModule, NgClass, CommonModule, HlmButtonDirective],
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
