// fee-plan-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CREATE_FEE_PLAN, GET_ALL_DROPDOWNS } from '../../../utils/apiPaths';
import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '@spartan-ng/helm/sonner';

interface FeePlanComponent {
  name: string;
  amount: number;
  frequency: string;
}

interface Discount {
  description: string;
  amount: number;
}

interface FeePlan {
  title: string;
  components: FeePlanComponent[];
  admissionFee: number;
  securityDeposit: number;
  discounts: Discount[];
  class: string;
  isActive: boolean;
}

interface GradeSection {
  _id: string;
  grade: number;
  section: string;
  displayText?: string;
}

@Component({
  selector: 'app-fee-structure',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmToasterComponent],
  templateUrl: './fee-structure.html',
  styleUrls: ['./fee-structure.css'],
})
export class FeeStructure implements OnInit {
  feePlanForm: FormGroup;
  gradeSections: GradeSection[] = [];
  isLoadingDropdowns = false;

  frequencyOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'one-time', label: 'One Time' },
  ];

  constructor(private fb: FormBuilder, private readonly http: HttpClient) {
    this.feePlanForm = this.createForm();
  }

  ngOnInit() {
    this.getAllDropDowns();
    this.addInitialComponents();
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      components: this.fb.array([]),
      admissionFee: ['', [Validators.required, Validators.min(0)]],
      securityDeposit: ['', [Validators.required, Validators.min(0)]],
      discounts: this.fb.array([]),
      class: ['', Validators.required],
      isActive: [true],
    });
  }

  get componentsFormArray(): FormArray {
    return this.feePlanForm.get('components') as FormArray;
  }

  get discountsFormArray(): FormArray {
    return this.feePlanForm.get('discounts') as FormArray;
  }

  createComponentFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      amount: ['', [Validators.required, Validators.min(1)]],
      frequency: ['monthly', Validators.required],
    });
  }

  createDiscountFormGroup(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      amount: ['', [Validators.required, Validators.min(1)]],
    });
  }

  addInitialComponents() {
    // Add initial components as per your schema example
    const initialComponents = [
      { name: 'Tuition Fee', amount: 5000, frequency: 'monthly' },
      { name: 'Transport Fee', amount: 2000, frequency: 'monthly' },
      { name: 'Lab Fee', amount: 3000, frequency: 'yearly' },
    ];

    initialComponents.forEach((component) => {
      const componentGroup = this.createComponentFormGroup();
      componentGroup.patchValue(component);
      this.componentsFormArray.push(componentGroup);
    });

    // Add initial discounts
    const initialDiscounts = [
      { description: 'Sibling Discount', amount: 2000 },
      { description: 'Scholarship', amount: 5000 },
    ];

    initialDiscounts.forEach((discount) => {
      const discountGroup = this.createDiscountFormGroup();
      discountGroup.patchValue(discount);
      this.discountsFormArray.push(discountGroup);
    });
  }

  addComponent() {
    this.componentsFormArray.push(this.createComponentFormGroup());
  }

  removeComponent(index: number) {
    if (this.componentsFormArray.length > 1) {
      this.componentsFormArray.removeAt(index);
    } else {
      toast.error('At least one fee component is required');
    }
  }

  addDiscount() {
    this.discountsFormArray.push(this.createDiscountFormGroup());
  }

  removeDiscount(index: number) {
    this.discountsFormArray.removeAt(index);
  }

  getAllDropDowns() {
    this.isLoadingDropdowns = true;
    this.http
      .get<GradeSection[]>(`${environment.apiUrl}${GET_ALL_DROPDOWNS}`)
      .subscribe({
        next: (res) => {
          this.gradeSections = res.map((item) => ({
            ...item,
            displayText: `Grade ${item.grade} - Section ${item.section}`,
          }));
          this.isLoadingDropdowns = false;
        },
        error: (ex) => {
          console.error(ex);
          this.isLoadingDropdowns = false;
          toast.error('Failed to load grade and section data');
        },
      });
  }

  getSelectedClass(): string {
    const selectedClassId = this.feePlanForm.get('class')?.value;
    if (selectedClassId) {
      const selectedClass = this.gradeSections.find(
        (item) => item._id === selectedClassId
      );

      if (selectedClass) {
        return `Grade ${selectedClass.grade}, Section ${selectedClass.section}`;
      }
    }
    return '';
  }

  calculateTotalFees(): number {
    const components = this.componentsFormArray.value;
    const admissionFee =
      Number(this.feePlanForm.get('admissionFee')?.value) || 0;
    const securityDeposit =
      Number(this.feePlanForm.get('securityDeposit')?.value) || 0;

    const componentTotal = components.reduce(
      (total: number, component: FeePlanComponent) => {
        return total + (Number(component.amount) || 0);
      },
      0
    );

    return componentTotal + admissionFee + securityDeposit;
  }

  calculateTotalDiscounts(): number {
    const discounts = this.discountsFormArray.value;
    return discounts.reduce((total: number, discount: Discount) => {
      return total + (Number(discount.amount) || 0);
    }, 0);
  }

  getFormValues(): any {
    if (this.feePlanForm.valid) {
      const formValue = this.feePlanForm.value;
      const selectedClass = this.gradeSections.find(
        (item) => item._id === formValue.class
      );

      return {
        ...formValue,
        components: formValue.components.map((comp: any) => ({
          ...comp,
          amount: Number(comp.amount),
        })),
        discounts: formValue.discounts.map((disc: any) => ({
          ...disc,
          amount: Number(disc.amount),
        })),
        admissionFee: Number(formValue.admissionFee),
        securityDeposit: Number(formValue.securityDeposit),
        selectedClassInfo: selectedClass,
      };
    }
    return null;
  }

  controlHasError(controlName: string, errorType: string): boolean {
    const control = this.feePlanForm.get(controlName);
    return !!(control && control.touched && control.hasError(errorType));
  }

  componentControlHasError(
    index: number,
    controlName: string,
    errorType: string
  ): boolean {
    const control = this.componentsFormArray.at(index).get(controlName);
    return !!(control && control.touched && control.hasError(errorType));
  }

  discountControlHasError(
    index: number,
    controlName: string,
    errorType: string
  ): boolean {
    const control = this.discountsFormArray.at(index).get(controlName);
    return !!(control && control.touched && control.hasError(errorType));
  }

  onSubmit() {
    if (this.feePlanForm.valid) {
      const formValue = this.feePlanForm.value;

      const feePlanData: FeePlan = {
        title: formValue.title,
        components: formValue.components.map((comp: any) => ({
          name: comp.name,
          amount: Number(comp.amount),
          frequency: comp.frequency,
        })),
        admissionFee: Number(formValue.admissionFee),
        securityDeposit: Number(formValue.securityDeposit),
        discounts: formValue.discounts.map((disc: any) => ({
          description: disc.description,
          amount: Number(disc.amount),
        })),
        class: formValue.class,
        isActive: formValue.isActive,
      };

      this.http
        .post(`${environment.apiUrl}${CREATE_FEE_PLAN}`, feePlanData)
        .subscribe({
          next: (res) => {
            toast.success('Fee structure has been submitted successfully');
            this.onReset();
          },
          error: (err) => {
            if (err.message === Array.isArray(err.message)) {
              for (let i = 0; i < err.message.length; i++) {
                toast.error(err.message[i]);
              }
            } else {
              toast.error(err.message);
            }
          },
        });
    } else {
      this.markFormGroupTouched();
      toast.error('Please fill all required fields correctly');
    }
  }

  onReset() {
    this.feePlanForm.reset();
    // Clear form arrays
    while (this.componentsFormArray.length > 0) {
      this.componentsFormArray.removeAt(0);
    }
    while (this.discountsFormArray.length > 0) {
      this.discountsFormArray.removeAt(0);
    }
    // Re-add initial data
    this.addInitialComponents();
    // Reset isActive to true
    this.feePlanForm.get('isActive')?.setValue(true);
  }

  private markFormGroupTouched() {
    Object.keys(this.feePlanForm.controls).forEach((key) => {
      const control = this.feePlanForm.get(key);
      if (control) {
        control.markAsTouched();

        // Mark FormArray controls as touched
        if (control instanceof FormArray) {
          control.controls.forEach((arrayControl) => {
            if (arrayControl instanceof FormGroup) {
              Object.keys(arrayControl.controls).forEach((arrayKey) => {
                arrayControl.get(arrayKey)?.markAsTouched();
              });
            }
          });
        }
      }
    });
  }
}
