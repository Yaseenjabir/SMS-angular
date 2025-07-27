import { Component } from '@angular/core';
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
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import { HlmSwitchComponent } from '@spartan-ng/helm/switch';
import { HlmSeparatorDirective } from '@spartan-ng/helm/separator';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  school: string;
  address: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  systemAlerts: boolean;
}

interface SystemSettings {
  darkMode: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

@Component({
  selector: 'app-settings',
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
    HlmLabelDirective,
    HlmSwitchComponent,
    HlmSeparatorDirective,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  isLoading = false;

  // Mock user data (in real app, this would come from auth service)
  user = {
    name: 'John Doe',
    email: 'john.doe@school.edu',
    role: 'Administrator',
  };

  // Form states
  profileData: ProfileData = {
    name: this.user.name,
    email: this.user.email,
    phone: '+1-555-0123',
    school: 'Springfield High School',
    address: '123 Education St, Springfield',
  };

  notificationSettings: NotificationSettings = {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    systemAlerts: true,
  };

  systemSettings: SystemSettings = {
    darkMode: false,
    language: 'English',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
  };

  async handleSaveProfile() {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      // In real app, you would show a toast notification here
      console.log(
        'Profile Updated: Your profile has been updated successfully.'
      );
      this.isLoading = false;
    }, 1000);
  }

  async handleSaveNotifications() {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      // In real app, you would show a toast notification here
      console.log(
        'Notification Preferences Updated: Your notification settings have been saved.'
      );
      this.isLoading = false;
    }, 1000);
  }

  async handleSaveSystem() {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      // In real app, you would show a toast notification here
      console.log(
        'System Settings Updated: Your system preferences have been saved.'
      );
      this.isLoading = false;
    }, 1000);
  }

  handleLogout() {
    // In real app, you would call the auth service logout method
    console.log('Logged Out: You have been successfully logged out.');
  }
}
