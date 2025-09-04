import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { AnnouncementForm } from './announcement-form/announcement-form';
import { HlmToasterComponent } from '@spartan-ng/helm/sonner';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { GET_ALL_ANNOUNCEMENT } from '../../utils/apiPaths';

// Updated interface to match API response
interface ApiAnnouncementResponse {
  _id: string;
  title: string;
  description: string;
  to_whom: string;
  priority: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Keep the existing interface for internal use
interface AnnouncementType {
  id: string;
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
    AnnouncementForm,
    HlmToasterComponent,
  ],
  templateUrl: './announcements.html',
  styleUrl: './announcements.css',
})
export class Announcements implements OnInit {
  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  searchTerm = '';
  priorityFilter = 'all';
  selectedAnnouncement: AnnouncementType | null = null;
  announcementsData: AnnouncementType[] = [];
  isLoading = false;
  error: string | null = null;

  private loadAnnouncements(): void {
    this.isLoading = true;
    this.error = null;

    this.http
      .get<ApiAnnouncementResponse[]>(
        `${environment.apiUrl}${GET_ALL_ANNOUNCEMENT}`
      )
      .subscribe({
        next: (apiResponse) => {
          console.log('API Response:', apiResponse);
          this.announcementsData = this.transformApiData(apiResponse);
          this.isLoading = false;
        },
        error: (ex) => {
          console.error('Error loading announcements:', ex);
          this.error = 'Failed to load announcements. Please try again.';
          this.isLoading = false;
        },
      });
  }

  private transformApiData(
    apiData: ApiAnnouncementResponse[]
  ): AnnouncementType[] {
    return apiData.map((item) => ({
      id: item._id,
      title: item.title,
      content: item.description,
      date: item.createdAt,
      author: this.getAuthorFromAudience(item.to_whom),
      priority: this.capitalizePriority(item.priority),
      targetAudience: this.formatTargetAudience(item.to_whom),
      status: item.is_active ? 'Active' : 'Archived',
      attachments: [],
    }));
  }

  private capitalizePriority(priority: string): string {
    return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  }

  private formatTargetAudience(toWhom: string): string {
    const audienceMap: { [key: string]: string } = {
      all: 'All',
      teacher: 'Teachers',
      parent: 'Parents',
      student: 'Students',
    };
    return audienceMap[toWhom] || toWhom;
  }

  private getAuthorFromAudience(toWhom: string): string {
    const authorMap: { [key: string]: string } = {
      all: 'Administration',
      teacher: 'HR Department',
      parent: 'Academic Coordinator',
      student: 'Principal',
    };
    return authorMap[toWhom] || 'Administration';
  }

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

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return this.formatDate(dateString);
  };

  setSelectedAnnouncement(announcement: AnnouncementType) {
    this.selectedAnnouncement = announcement;
  }

  // Method to refresh announcements
  refreshAnnouncements(): void {
    this.loadAnnouncements();
  }

  // Method to retry loading on error
  retryLoading(): void {
    this.loadAnnouncements();
  }
}
