import { AfterViewInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';

import { timeout } from 'rxjs/operators';
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
  constructor(public dialog: MatDialog) { }

  ngAfterViewInit(): void {
      this.temp = new TradingView.widget(
        {
        "width": 1300,
        "height": 610,
        "symbol": "BITSTAMP:BTCUSD",
        "interval": "5",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "1",
        "locale": "in",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "watchlist": [
          "BITBAY:BTCUSD",
          "KRAKEN:ETHUSD",
          "BITKUB:BNBTHB",
          "BITKUB:ADATHB",
          "BINGBON:TRXUSDT",
          "BITKUB:DOTTHB",
          "BINANCE:XRPUSDT",
          "GEMINI:UNIUSD",
          "BINANCE:LTCUSDT",
          "BINANCE:LINKUSDT",
          "KRAKEN:BCHUSD",
          "KRAKEN:USDCUSD",
          "KRAKEN:XLMUSD",
          "BINANCE:LUNAUSDT",
          "BINANCE:THETAUSDT",
          "COINBASE:WBTCUSD",
          "BINANCE:DOGEUSDT",
          "OKEX:CROUSDT",
          "BITFINEX:VETUSD",
          "BINANCE:FILUSDT",
          "BINANCE:AAVEUSDT",
          "KRAKEN:ATOMUSD",
          "BINANCE:AVAXUSDT",
          "KRAKEN:TRXUSD",
          "BINANCE:EOSUSDT"
        ],
        "container_id": "tradingview_b0bf0"
      });
        console.log(this.temp.options.symbol);
      setInterval(()=>{console.log(this.temp.options.symbol)},5000)
  }

  openDialogBuy(): void {
    // tslint:disable-next-line: no-use-before-declare
    this.dialog.open(DialogTrade, {});
  }

  openDialogSell(): void {
    // tslint:disable-next-line: no-use-before-declare
    this.dialog.open(DialogSell, {});
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
