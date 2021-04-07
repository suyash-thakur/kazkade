import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuycomComponent } from './buycom.component';

describe('BuycomComponent', () => {
  let component: BuycomComponent;
  let fixture: ComponentFixture<BuycomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuycomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuycomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
