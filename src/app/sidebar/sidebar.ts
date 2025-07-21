import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
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
}
