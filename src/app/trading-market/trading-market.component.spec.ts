import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingMarketComponent } from './trading-market.component';

describe('TradingMarketComponent', () => {
  let component: TradingMarketComponent;
  let fixture: ComponentFixture<TradingMarketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradingMarketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
