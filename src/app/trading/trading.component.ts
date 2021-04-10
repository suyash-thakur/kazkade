import { AfterViewInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ChangeDetectorRef } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { AuthService } from '../shared/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

// import { setInterval } from 'timers';
declare const TradingView: any;
@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.css']
})
export class TradingComponent implements AfterViewInit {

  selectedCoin = 'BTCUSD';
  temp;
  status = [];
  isLoggedIn = false;
  isInsufficientFund = false;
  chartWidth = 0;
  sellAmount = '';
  buyAmount = '';
  width = 0;
  index = 0;
  wathcList = [
    "BINANCE:ETHUSDT",
    "BINANCE:BNBUSD",
    "BINANCE:CHZUSDT",
    "BINANCE:DOGEUSDT",
    "BINANCE:DOTUSDT",
    "BINANCE:ENJUSDT",
    "BINANCE:ONTUSDT",
    "BINANCE:DENTUSDT",
    "BINANCE:EGLDUSDT",
    "BINANCE:ETHUSDT",
    "BINANCE:BNBUSD",
    "BINANCE:CHZUSDT",
    "BINANCE:DOGEUSDT",
    "BINANCE:DOTUSDT",
    "BINANCE:ENJUSDT",
    "BINANCE:ONTUSDT",
    "BINANCE:DENTUSDT",
    "BINANCE:EGLDUSDT",
    "BINANCE:ETHUSDT",
    "BINANCE:BNBUSD",
    "BINANCE:CHZUSDT",
    "BINANCE:DOGEUSDT",
    "BINANCE:DOTUSDT",
    "BINANCE:ENJUSDT",
    "BINANCE:ONTUSDT",
    "BINANCE:DENTUSDT",
    "BINANCE:EGLDUSDT"
  ];
  getstockName(data): string {
    var name = data.split(':')[1];
    return name;
  }

  constructor(public dialog: MatDialog, private cdRef: ChangeDetectorRef, public authService: AuthService, public http: HttpClient, public router: Router) {
    this.width = window.innerWidth;
    console.log(this.width);
    this.chartWidth = this.width -320 -236 -40;
    console.log(this.chartWidth);

  }

  ngAfterViewInit(): void {
      this.temp = new TradingView.widget(
        {


        "symbol": this.wathcList[this.index],
        "interval": "5",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "1",
          "locale": "in",
          "width": this.chartWidth,
          "height": 400,
          "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
          "allow_symbol_change": true,

        "container_id": "tradingview_b0bf0"
      });
    console.log(this.temp.options.symbol);

    setInterval(() => {
      console.log(this.temp.options.symbol);
      this.status = [];
      for (var i = 0; i < 30; i++) {
        this.status.push(this.getProfitStatus());
      }
    }, 5000)
    this.cdRef.detectChanges();
  }

  openDialogBuy(): void {
    // tslint:disable-next-line: no-use-before-declare
    this.dialog.open(DialogTrade, {});
  }

  openDialogSell(): void {
    // tslint:disable-next-line: no-use-before-declare
    this.dialog.open(DialogSell, {});
  }
  getProfitStatus(): boolean {

    if (Math.random() > 0.5) {
      return true;
    } else {
      return false;
    }
  }
  clickWishList(data): void {
    console.log('datacalled');
    this.index = data;
    this.temp = new TradingView.widget(
      {
      "symbol": this.wathcList[data],
      "interval": "5",
      "timezone": "Etc/UTC",
      "theme": "light",
      "style": "1",
        "locale": "in",
        "width": this.chartWidth,
        "height": 400,
        "toolbar_bg": "#f1f3f6",
      "enable_publishing": false,
        "allow_symbol_change": true,

      "container_id": "tradingview_b0bf0"
    });
  }

  buy(): void{
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    console.log(this.buyAmount);
    this.isInsufficientFund = false;
    var symbol = this.getstockName(this.wathcList[this.index]);
    console.log(symbol);
    this.http.post(environment.Route + '/api/action/buy', {
      symbol: symbol,
      quantity: this.buyAmount
    }).subscribe((res:any) => {
      console.log(res);
      if (res.code === -2010) {
        this.isInsufficientFund = true;
      }

    },   (err: HttpErrorResponse) => {
      console.log (err.message);
    });
  }
  sell(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.sellAmount;
    console.log('sell');
    var symbol = this.getstockName(this.wathcList[this.index]);
    this.http.post(environment.Route + '/api/action/sell', {
      symbol: symbol,
      quantity: this.sellAmount
    }).subscribe((res:any) => {
      console.log(res);
      if (res.code === -2010) {
        this.isInsufficientFund = true;
      }

    },   (err: HttpErrorResponse) => {
      console.log (err.message);
    });
    }
}

@Component({
  selector: 'dialog-trade',
  templateUrl: 'dialog-trade.html',
  styleUrls: ['trading.component.css']
})
export class DialogTrade {
  constructor(public dialogRef: MatDialogRef<DialogTrade>) {}
    onNoClick(): void {
      this.dialogRef.close();
    }
}

@Component({
  selector: 'dialog-sell',
  templateUrl: 'dialog-sell.html',
  styleUrls: ['trading.component.css']
})
export class DialogSell {
  constructor(public dialogRef: MatDialogRef<DialogSell>) {}
    onNoClick(): void {
      this.dialogRef.close();
    }
}
