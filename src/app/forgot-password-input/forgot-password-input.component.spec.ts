import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordInputComponent } from './forgot-password-input.component';

describe('ForgotPasswordInputComponent', () => {
  let component: ForgotPasswordInputComponent;
  let fixture: ComponentFixture<ForgotPasswordInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
