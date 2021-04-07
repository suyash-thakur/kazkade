import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinancekeysComponent } from './binancekeys.component';

describe('BinancekeysComponent', () => {
  let component: BinancekeysComponent;
  let fixture: ComponentFixture<BinancekeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinancekeysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinancekeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
