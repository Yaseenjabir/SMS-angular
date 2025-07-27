import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import feesData from '../../data/fees.json';
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
  HlmTableDirective,
  HlmTrDirective,
  HlmThDirective,
  HlmTdDirective,
} from '@spartan-ng/helm/table';

interface FeeType {
  id: number;
  studentName: string;
  studentId: number;
  class: string;
  rollNo: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: string;
  dueDate: string;
  paymentDate: string | null;
  paymentMethod: string | null;
  receipt: string | null;
}

@Component({
  selector: 'app-fees',
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
    HlmTableDirective,
    HlmTrDirective,
    HlmThDirective,
    HlmTdDirective,
  ],
  templateUrl: './fees.html',
  styleUrl: './fees.css',
})
export class Fees {
  searchTerm = '';
  statusFilter = 'all';
  feesData: FeeType[] = feesData;

  // Computed properties for summary statistics
  get totalAmount(): number {
    return this.feesData.reduce((sum, fee) => sum + fee.totalAmount, 0);
  }

  get paidAmount(): number {
    return this.feesData.reduce((sum, fee) => sum + fee.paidAmount, 0);
  }

  get dueAmount(): number {
    return this.feesData.reduce((sum, fee) => sum + fee.dueAmount, 0);
  }

  get paidCount(): number {
    return this.feesData.filter((fee) => fee.paymentStatus === 'Paid').length;
  }

  get dueCount(): number {
    return this.feesData.filter((fee) => fee.paymentStatus === 'Due').length;
  }

  get partialCount(): number {
    return this.feesData.filter((fee) => fee.paymentStatus === 'Partial')
      .length;
  }

  get collectionRate(): number {
    return this.totalAmount > 0
      ? (this.paidAmount / this.totalAmount) * 100
      : 0;
  }

  // Filter fees based on search and status - reactive getter
  get filteredFees(): FeeType[] {
    return this.feesData.filter((fee) => {
      const matchesSearch =
        fee.studentName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        fee.rollNo.includes(this.searchTerm) ||
        fee.class.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus =
        this.statusFilter === 'all' || fee.paymentStatus === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  // Get recent payments for payment history
  get recentPayments(): FeeType[] {
    return this.feesData
      .filter((fee) => fee.paymentDate)
      .sort(
        (a, b) =>
          new Date(b.paymentDate!).getTime() -
          new Date(a.paymentDate!).getTime()
      )
      .slice(0, 5);
  }

  getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-success text-success-foreground';
      case 'Due':
        return 'bg-destructive text-destructive-foreground';
      case 'Partial':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
}
