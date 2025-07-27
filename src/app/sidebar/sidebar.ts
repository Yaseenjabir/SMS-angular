import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() isCollapsed = false;
  @Output() onToggle = new EventEmitter<void>();

  menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/students', label: 'Students', icon: '👨‍🎓' },
    { path: '/teachers', label: 'Teachers', icon: '👩‍🏫' },
    { path: '/classes', label: 'Classes', icon: '🏫' },
    { path: '/exams', label: 'Exams', icon: '📝' },
    { path: '/fees', label: 'Fees', icon: '💰' },
    { path: '/announcements', label: 'Announcements', icon: '📢' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  toggleSidebar() {
    this.onToggle.emit();
  }
  logHello() {
    console.log(this.isCollapsed);
  }
}
