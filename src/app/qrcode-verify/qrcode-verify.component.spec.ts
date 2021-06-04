import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeVerifyComponent } from './qrcode-verify.component';

describe('QrcodeVerifyComponent', () => {
  let component: QrcodeVerifyComponent;
  let fixture: ComponentFixture<QrcodeVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrcodeVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodeVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
