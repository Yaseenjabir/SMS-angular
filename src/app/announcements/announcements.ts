import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import announcementsData from '../../data/announcements.json';
import {
  HlmCardDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
  HlmCardContentDirective,
} from '@spartan-ng/helm/card';
import { HlmBadgeDirective } from '@spartan-ng/helm/badge';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/helm/dialog';
import {
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/brain/dialog';

interface AnnouncementType {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: string;
  targetAudience: string;
  status: string;
  attachments: string[];
}

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardContentDirective,
    HlmBadgeDirective,
    HlmButtonDirective,
    HlmInputDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
  ],
  templateUrl: './announcements.html',
  styleUrl: './announcements.css',
})
export class Announcements {
  searchTerm = '';
  priorityFilter = 'all';
  selectedAnnouncement: AnnouncementType | null = null;
  announcementsData: AnnouncementType[] = announcementsData;

  // Computed properties for summary statistics
  get totalAnnouncementsCount(): number {
    return this.announcementsData.length;
  }

  get activeAnnouncementsCount(): number {
    return this.announcementsData.filter((a) => a.status === 'Active').length;
  }

  get highPriorityCount(): number {
    return this.announcementsData.filter((a) => a.priority === 'High').length;
  }

  get thisWeekCount(): number {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return this.announcementsData.filter((a) => {
      const announcementDate = new Date(a.date);
      return announcementDate >= weekAgo;
    }).length;
  }

  // Filter announcements based on search and priority - reactive getter
  get filteredAnnouncements(): AnnouncementType[] {
    return this.announcementsData.filter((announcement) => {
      const matchesSearch =
        announcement.title
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        announcement.content
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        announcement.author
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      const matchesPriority =
        this.priorityFilter === 'all' ||
        announcement.priority === this.priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }

  // Sort announcements by date (newest first) - reactive getter
  get sortedAnnouncements(): AnnouncementType[] {
    return this.filteredAnnouncements.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-destructive text-destructive-foreground';
      case 'Medium':
        return 'bg-warning text-warning-foreground';
      case 'Low':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-success text-success-foreground';
      case 'Archived':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return this.formatDate(dateString);
  };

  setSelectedAnnouncement(announcement: AnnouncementType) {
    this.selectedAnnouncement = announcement;
  }
}
