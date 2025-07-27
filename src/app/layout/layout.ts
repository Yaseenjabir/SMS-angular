import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { Topbar } from '../topbar/topbar';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, Sidebar, CommonModule, Topbar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  isCollapsed = true;

  isSidebarCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
