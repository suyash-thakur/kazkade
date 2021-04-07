import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtlistComponent } from './mtlist.component';

describe('MtlistComponent', () => {
  let component: MtlistComponent;
  let fixture: ComponentFixture<MtlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
