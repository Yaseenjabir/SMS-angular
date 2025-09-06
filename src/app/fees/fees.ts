import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  HlmCardDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
  HlmCardContentDirective,
} from '@spartan-ng/helm/card';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import {
  HlmTableDirective,
  HlmTrDirective,
  HlmThDirective,
  HlmTdDirective,
} from '@spartan-ng/helm/table';
import { FeeStructure } from './fee-structure/fee-structure';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
} from '@spartan-ng/helm/dialog';
import {
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/brain/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { GET_ALL_FEE_PLANS } from '../../utils/apiPaths';
import { toast } from 'ngx-sonner';
// Types for new fee plan object
interface FeeComponent {
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
}

interface Discount {
  description: string;
  amount: number;
}

export interface FeePlan {
  title: string;
  components: FeeComponent[];
  admissionFee: number;
  securityDeposit: number;
  discounts: Discount[];
  class: {
    grade: number;
    section: string;
  };
  isActive: boolean;
}

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    CommonModule,
    FormsModule,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardContentDirective,
    FeeStructure,
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
export class Fees implements OnInit {
  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<FeePlan[]>(`${environment.apiUrl}${GET_ALL_FEE_PLANS}`)
      .subscribe({
        next: (res) => {
          this.feePlans = res;
        },
        error: (ex) => {
          toast.error(ex.message);
          console.log(ex);
        },
      });
  }

  searchTerm = '';
  statusFilter = 'all';

  // Dummy API data (replace with service call later)
  // feePlans: FeePlan[] = [
  //   {
  //     title: 'Grade 7 Fee Plan - 2024',
  //     components: [
  //       { name: 'Tuition Fee', amount: 5000, frequency: 'monthly' },
  //       { name: 'Transport Fee', amount: 2000, frequency: 'monthly' },
  //       { name: 'Lab Fee', amount: 3000, frequency: 'yearly' },
  //     ],
  //     admissionFee: 10000,
  //     securityDeposit: 5000,
  //     discounts: [
  //       { description: 'Sibling Discount', amount: 2000 },
  //       { description: 'Scholarship', amount: 5000 },
  //     ],
  //     class: {
  //       grade: 8,
  //       section: 'B',
  //     },
  //     isActive: true,
  //   },
  //   {
  //     title: 'Grade 8 Fee Plan - 2024',
  //     components: [
  //       { name: 'Tuition Fee', amount: 6000, frequency: 'monthly' },
  //       { name: 'Transport Fee', amount: 2500, frequency: 'monthly' },
  //     ],
  //     admissionFee: 12000,
  //     securityDeposit: 6000,
  //     discounts: [{ description: 'Merit Scholarship', amount: 4000 }],
  //     class: {
  //       grade: 7,
  //       section: 'R',
  //     },
  //     isActive: false,
  //   },
  // ];
  feePlans: FeePlan[] = [];

  // Computed values
  get totalAdmissionFees(): number {
    return this.feePlans.reduce((sum, plan) => sum + plan.admissionFee, 0);
  }

  get totalSecurityDeposits(): number {
    return this.feePlans.reduce((sum, plan) => sum + plan.securityDeposit, 0);
  }

  get totalDiscounts(): number {
    return this.feePlans.reduce(
      (sum, plan) =>
        sum + plan.discounts.reduce((dsum, d) => dsum + d.amount, 0),
      0
    );
  }

  get filteredPlans(): FeePlan[] {
    return this.feePlans.filter((plan) =>
      plan.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  formatCurrency(amount: number): string {
    return `$${amount.toLocaleString()}`;
  }
}
