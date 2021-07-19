import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotSoonComponent } from './spot-soon.component';

describe('SpotSoonComponent', () => {
  let component: SpotSoonComponent;
  let fixture: ComponentFixture<SpotSoonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotSoonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotSoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
