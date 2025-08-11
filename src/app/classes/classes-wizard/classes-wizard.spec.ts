import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesWizard } from './classes-wizard';

describe('ClassesWizard', () => {
  let component: ClassesWizard;
  let fixture: ComponentFixture<ClassesWizard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassesWizard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassesWizard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
