import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterUserSettingComponent } from './master-user-setting.component';

describe('MasterUserSettingComponent', () => {
  let component: MasterUserSettingComponent;
  let fixture: ComponentFixture<MasterUserSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterUserSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterUserSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
