import { Component } from '@angular/core';
import studentsData from '../../data/students.json';
import teachersData from '../../data/teachers.json';
import feesData from '../../data/fees.json';
import announcementsData from '../../data/announcements.json';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  today = new Date().toLocaleDateString();
  // Calculate statistics
  totalStudents = studentsData.length;
  activeStudents = studentsData.filter((s) => s.status === 'Active').length;
  totalTeachers = teachersData.length;
  totalPendingFees = feesData.reduce((sum, fee) => sum + fee.dueAmount, 0);
  recentAnnouncements = announcementsData
    .filter((a) => a.status === 'Active')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Calculate attendance statistics
  avgAttendance = 95.2; // Static value since attendance removed

  statsCards = [
    {
      title: 'Total Students',
      value: this.totalStudents.toString(),
      subtitle: `${this.activeStudents} Active`,
      icon: '👨‍🎓',
      color: 'bg-primary',
    },
    {
      title: 'Total Teachers',
      value: this.totalTeachers.toString(),
      subtitle: 'All Active',
      icon: '👩‍🏫',
      color: 'bg-success',
    },
    {
      title: 'Pending Fees',
      value: `$${this.totalPendingFees.toLocaleString()}`,
      subtitle: 'Outstanding',
      icon: '💰',
      color: 'bg-warning',
    },
    {
      title: 'Avg Attendance',
      value: `${this.avgAttendance.toFixed(1)}%`,
      subtitle: 'This Week',
      icon: '📊',
      color: 'bg-accent',
    },
  ];
}
