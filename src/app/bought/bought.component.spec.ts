import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoughtComponent } from './bought.component';

describe('BoughtComponent', () => {
  let component: BoughtComponent;
  let fixture: ComponentFixture<BoughtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoughtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoughtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
