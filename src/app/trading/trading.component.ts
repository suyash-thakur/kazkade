import { AfterViewInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectorRef } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { AuthService } from '../shared/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, tap, switchAll } from 'rxjs/operators';
import { Router } from '@angular/router';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { MatSliderChange } from '@angular/material/slider';
import { formatLabel } from '@swimlane/ngx-charts';
import { Subject } from 'rxjs';
// import { setInterval } from 'timers';
declare const TradingView: any;

export interface CoinInfo {
  symbol: string,
  minPrice: number,
  maxPrice: number,
  minQty: number,
  maxQty: number
  stepSize: number,
  priceChangePercent: string,
  priceChange: string,
  lastPrice: number,
  precision: number,
  volume: Array<any>

}
@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.css']
})
export class TradingComponent implements AfterViewInit {

  myWebSocket = webSocket('wss://stream.binance.com:9443/ws');
  selectedCoin = 'ETHUSDT';
  temp;
  buyAtPriceLimit: number;
  sellAtPriceLimit: number;
  isLimit = false;
  isLImitSell = false;
  currentLeverage = 1;
  marketType = 'Future';
  isUDST = true;
  isAUD = false;
  currentCurrency = 'USDT';
  status = [];
  isStopLoss = false;
  isStopLossSell = false;
  buyTotalPrice = 0;
  sellTotalPrice = 0;
  isLoggedIn = false;
  isInsufficientFund = false;
  isInsufficientFund2 = false;
  isLoaded = false;
  Object = Object;
  chartWidth = 0;
  sellAmount: any = 0;
  sellQuantity = 0;
  errMsg = '';
  errMsg2 = '';
  stopLimitValue = 'LIMIT';
  sellStopLimitValue = 'LIMIT';
  stopPriceSell = 0;
  stopPriceBuy = 0;
  openOrders = {};
  completedOrders = [];
  closePercentage = [];
  positions = [];
  buyAmount: any = 0;
  buyAtPrice = 0;
  sellAtPrice = 0
  coinLevrage = 0;
  isFuture = true;
  isIsolated = true;

  width = 0;
  index = 0;
  coinDataList: any = {};
  maxLev: any = {
    '1INCHUSDT': 50,
    'ALGOUSDT': 50,
    'AVAXUSDT': 50,
    'BANDUSDT': 50,
    'BNBUSDT': 75,
    'BTCUSDT': 125,
    'BZRXUSDT': 50,
    'CELRUSDT': 50,
    'CRVUSDT': 50,
    'DOTUSDT': 75,
    'EOSUSDT': 50,
    'ETHUSDT': 100,
    'FLMUSDT': 50,
    'KAVAUSDT': 50,
    'LINKUSDT': 75,
    'LITUSDT': 50,
    'ONEUSDT': 50,
    'RLCUSDT': 50,
    'SXPUSDT': 50,
    'TRXUSDT': 75,
    'UNIUSDT': 50,
    'XLMUSDT': 75,
    'XRPUSDT': 75,
    'YFIUSDT': 50,
    'ZRXUSDT': 50

  }


  wathcList: Array<any> = [
    'BINANCE:ETH' + this.currentCurrency,
    'BINANCE:BNB' + this.currentCurrency,
    'BINANCE:DOT' + this.currentCurrency,
    'BINANCE:BTC' + this.currentCurrency,
    'BINANCE:ADA' + this.currentCurrency,
    'BINANCE:1INCH' + this.currentCurrency,
    'BINANCE:ALGO' + this.currentCurrency,
    'BINANCE:AVAX' + this.currentCurrency,
    'BINANCE:BZRX' + this.currentCurrency,
    'BINANCE:CELR' + this.currentCurrency,
    'BINANCE:CRV' + this.currentCurrency,
    'BINANCE:EOS' + this.currentCurrency,
    'BINANCE:FLM' + this.currentCurrency,
    'BINANCE:KAVA' + this.currentCurrency,
    'BINANCE:LIT' + this.currentCurrency,
    'BINANCE:ONE' + this.currentCurrency,
    'BINANCE:RLC' + this.currentCurrency,
    'BINANCE:SXP' + this.currentCurrency,
    'BINANCE:TRX' + this.currentCurrency,
    'BINANCE:UNI' + this.currentCurrency,
    'BINANCE:XLM' + this.currentCurrency,
    'BINANCE:XRP' + this.currentCurrency,
    'BINANCE:YFI' + this.currentCurrency,
    'BINANCE:ZRX' + this.currentCurrency,
    'BINANCE:LINK' + this.currentCurrency,


  ];
  wathcListAUD: Array<any> = [
    'BINANCE:ETH' + 'AUD',
    'BINANCE:BNB' + 'AUD',
    'BINANCE:CHZ' + 'AUD',
    'BINANCE:DOGE' + 'AUD',
    'BINANCE:DOT' + 'AUD',
    'BINANCE:ENJ' + 'AUD',
    'BINANCE:ONT' + 'AUD',
    'BINANCE:DENT' + 'AUD',
    'BINANCE:EGLD' + 'AUD',

  ];
  getstockName(data): string {
    const name = data.split(':')[1];
    return name;
  }
  getPricision(tickSize) {
    let data = tickSize;
    let i = 0;
    while (data !== 1) {
      data = data * 10;
      i = i + 1;
    }
    return i;
  }
  precision(a) {
    if (!isFinite(a)) return 0;
    var e = 1, p = 0;
    while (Math.round(a * e) / e !== a) { e *= 10; p++; }
    return p;
  }
  constructor(public dialog: MatDialog, private cdRef: ChangeDetectorRef, public authService: AuthService, public http: HttpClient, public router: Router) {
    if (this.isFuture) {
      this.myWebSocket = webSocket('wss://fstream.binance.com/ws');
    } else {
      this.myWebSocket = webSocket('wss://stream.binance.com:9443/ws');

    }
    this.width = window.innerWidth;
    this.changeCurreny('USDT');
    this.chartWidth = this.width - 320 - 236 - 40;
    this.http.get('https://fapi.binance.com/fapi/v1/exchangeInfo').subscribe((res: any) => {
      let number1 = 0;
      const number2 = 0;
      res.symbols.forEach(async (item: any, index, array) => {
        if (this.wathcList.indexOf('BINANCE:' + item.symbol) > -1) {
          const coinChange: any = await this.http.get('https://api.binance.com/api/v3/ticker/24hr?symbol=' + item.symbol).toPromise();
          const coinData: CoinInfo = {
            symbol: item.symbol,
            minPrice: item.filters[0].minPrice,
            maxPrice: item.filters[0].maxPrice,
            minQty: item.filters[2].minQty,
            maxQty: item.filters[2].maxQty,
            stepSize: item.filters[2].stepSize,
            precision: item.quantityPrecision,
            priceChangePercent: coinChange.priceChangePercent,
            priceChange: coinChange.priceChange,
            lastPrice: coinChange.prevClosePrice,
            volume: []
          }


          this.coinDataList[coinData.symbol] = coinData;
          number1 = number1 + 1;
        }

        if (number1 === (this.wathcList.length - 1)) {
          this.isLoaded = true;
        }
        if (index === res.symbols.length - 1) {
          this.http.get('https://fapi.binance.com/fapi/v1/exchangeInfo').subscribe((res: any) => {
            res.symbols.forEach((item) => {
              if (this.wathcList.indexOf('BINANCE:' + item.symbol) > -1) {
                console.log('called');
                this.coinDataList[item.symbol].precision = item.quantityPrecision;
              }

            })
          });
        }
      }

      );

      if (this.authService.isLoggedIn === true) {
        this.http.get(environment.Route + '/api/action/future-positions').subscribe((res: any) => {
          res.data.forEach(item => {
            if (item.entryPrice > 0) {
              this.positions.push(item);
              this.closePercentage.push(0.0);
            }
          });

          if (res !== {}) {
            this.openOrders = (res);
          }

        });
        this.http.get(environment.Route + '/api/action/future-all-orders').subscribe((res: any) => {
          if (res !== {}) {
            this.completedOrders = (res.data);
          }

        });

      }

    });

    this.http.get('https://api.binance.com/api/v3/trades?symbol=' + this.selectedCoin).subscribe((res) => {

    });
    if (this.authService.isLoggedIn === true) {
      this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res) => {
        if (res !== {}) {
          this.openOrders = res;
        }
      });
      this.http.get(environment.Route + '/api/action/future-all-orders').subscribe((res) => {

      });
    }
  }
  formatLabel(value: number) {
    if (value >= 1000) {
      this.currentLeverage = Math.round(value / 1000);
      return this.currentLeverage;
    }
    this.currentLeverage = value;
    return this.currentLeverage;
  }
  changeSpot() {
    this.isFuture = false;
    this.myWebSocket.unsubscribe();

    if (this.isFuture) {
      this.myWebSocket = webSocket('wss://fstream.binance.com/ws');
    } else {
      this.myWebSocket = webSocket('wss://stream.binance.com:9443/ws');

    }
    this.myWebSocket.subscribe();
    this.changeCurreny('USDT');

  }
  changeFuture() {
    this.isFuture = true;
    this.myWebSocket.unsubscribe();

    if (this.isFuture) {
      this.myWebSocket = webSocket('wss://fstream.binance.com/ws');
    } else {
      this.myWebSocket = webSocket('wss://stream.binance.com:9443/ws');

    }
    this.myWebSocket.subscribe();
    this.changeCurreny('USDT');

  }
  toggleIsolated() {
    this.isIsolated = !this.isIsolated;
    if (this.isIsolated) {
      this.http.post(environment.Route + '/api/action/future-margin-type', { symbol: this.selectedCoin, type: "ISOLATED" }).subscribe((res) => {
      });
    } else if (!this.isIsolated) {
      this.http.post(environment.Route + '/api/action/future-margin-type', { symbol: this.selectedCoin, type: "CROSSED" }).subscribe((res) => {
      });
    }
  }
  ngAfterViewInit(): void {
      this.temp = new TradingView.widget(
        {


          symbol: this.wathcList[this.index],
          interval: '5',
          timezone: 'Australia/Adelaide',
          theme: 'light',
          style: '1',
          locale: 'in',
          width: this.chartWidth,
          height: 500,
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          hide_side_toolbar: false,

          container_id: 'tradingview_b0bf0'
        });

    setInterval(() => {
      this.clickLowestPrice();
      this.clickHighestPrice();
    }, 5000)


    this.cdRef.detectChanges();
  }
  changeBuyAmount() {
    let amountDec = this.buyTotalPrice / this.coinDataList[this.selectedCoin].lastPrice;
    // let mult = Math.pow(10, this.coinDataList[this.selectedCoin].precision);
    // amountDec = amountDec * mult;
    // amountDec = Math.floor(amountDec);
    // amountDec = amountDec / mult;

    this.buyAmount = amountDec.toFixed(this.coinDataList[this.selectedCoin].precision);
  }
  changeTotalPrice() {
    if (this.marketType !== 'Future') {
      this.buyTotalPrice = this.buyAmount * this.coinDataList[this.selectedCoin].lastPrice;

    } else {
      this.buyTotalPrice = (this.buyAmount * this.coinDataList[this.selectedCoin].lastPrice) / this.currentLeverage;

    }
  }
  changeSellAmount() {
    let amountDec = this.sellTotalPrice / this.coinDataList[this.selectedCoin].lastPrice;

    this.sellAmount = amountDec.toFixed(this.coinDataList[this.selectedCoin].precision);
  }
  changeTotalPriceSell() {
    if (this.marketType !== 'Future') {

      this.sellTotalPrice = this.sellAmount * this.coinDataList[this.selectedCoin].lastPrice;

    } else {
      this.sellTotalPrice = (this.sellAmount * this.coinDataList[this.selectedCoin].lastPrice) / this.currentLeverage;
    }

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
    this.selectedCoin = data;
    this.buyAtPrice = this.coinDataList[this.selectedCoin].lastPrice;
    this.sellAtPrice = this.coinDataList[this.selectedCoin].lastPrice;
    this.temp = new TradingView.widget(
      {
        symbol: 'BINANCE:' + data,
        interval: '5',
        timezone: 'Etc/UTC',
        theme: 'light',
        style: '1',
        locale: 'in',
        width: this.chartWidth,
        height: 500,
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        hide_side_toolbar: false,


        container_id: 'tradingview_b0bf0'
      });

    this.http.post(environment.Route + '/api/action/future-margin-type', { symbol: this.selectedCoin, type: "ISOLATED" }).subscribe((res) => {
      this.isIsolated = true;
    });
  }
  buyLeverage(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.currentLeverage > this.maxLev[this.selectedCoin]) {
      this.currentLeverage = this.maxLev[this.selectedCoin];
    }
    if (this.currentLeverage <= 0) {
      this.currentLeverage = 1;
    }
    this.http.post(environment.Route + '/api/action/future-leverage', {
      symbol: this.selectedCoin,
      leverage: this.currentLeverage,
    }).subscribe((res: any) => {
      if (!this.isLimit && !this.isStopLoss) {

        this.http.post(environment.Route + '/api/action/future-buy', {
          symbol: this.selectedCoin,
          quantity: this.buyAmount,
          leverage: this.currentLeverage,
          quantityPrecision: this.coinDataList[this.selectedCoin].precision


        }).subscribe((res: any) => {
          this.http.get(environment.Route + '/api/action/future-positions').subscribe((res: any) => {
            res.data.forEach(item => {
              if (item.entryPrice > 0) {
                this.positions.push(item);
                this.closePercentage.push(0.0);
              }
            });


            if (res !== {}) {
              this.openOrders = (res);
            }

          });
          this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res) => {
            if (res !== {}) {
              this.openOrders = res;
            }

          });
          if (res.code === -2010) {
            this.isInsufficientFund = true;
            this.errMsg = 'Insufficient Fund';
          }
          else if (res.code === -2013) {
            this.isInsufficientFund = true;
            this.errMsg = 'Error Placing Order';
          }
          else if (res.code === -1013) {
            this.isInsufficientFund = true;
            this.errMsg = 'Amount Lower Than Minimun Limit';
          }
          else {
            this.isInsufficientFund = true;
            this.errMsg = res.msg;
          }
        }, (err: HttpErrorResponse) => {

        });
      }
      else if (this.isLimit && !this.isStopLoss) {
        this.http.post(environment.Route + '/api/action/future-buy', {
          symbol: this.selectedCoin,
          quantity: this.buyAmount,
          price: this.buyAtPriceLimit,
          leverage: this.currentLeverage,
          quantityPrecision: this.coinDataList[this.selectedCoin].precision

        }).subscribe((res: any) => {
          if (res.code === -2010) {
            this.isInsufficientFund = true;
            this.errMsg = 'Insufficient Fund';
          }
          else if (res.code === -2013) {
            this.isInsufficientFund = true;
            this.errMsg = 'Error Placing Order';
          }
          else if (res.code === -1013) {
            this.isInsufficientFund = true;
            this.errMsg = 'Amount Lower Than Minimun Limit';
          }
          else {
            this.isInsufficientFund = true;
            this.errMsg = res.msg;
          }
        }, (err: HttpErrorResponse) => {

        });
      }
      else if (this.isLimit && this.isStopLoss) {
        this.http.post(environment.Route + '/api/action/future-buy', {
          symbol: this.selectedCoin,
          quantity: this.buyAmount,
          price: this.buyAtPriceLimit,
          stopPrice: this.stopPriceBuy,
          leverage: this.currentLeverage,
          quantityPrecision: this.coinDataList[this.selectedCoin].precision


        }).subscribe((res: any) => {
          if (res.code === -2010) {
            this.isInsufficientFund = true;
            this.errMsg = 'Insufficient Fund';
          }
          else if (res.code === -2013) {
            this.isInsufficientFund = true;
            this.errMsg = 'Error Placing Order';
          }
          else if (res.code === -1013) {
            this.isInsufficientFund = true;
            this.errMsg = 'Amount Lower Than Minimun Limit';
          }
          else {
            this.isInsufficientFund = true;
            this.errMsg = res.msg;
          }
        }, (err: HttpErrorResponse) => {

        });
      }
      else if (this.isLimit && !this.isStopLoss) {
        this.http.post(environment.Route + '/api/action/future-buy', {
          symbol: this.selectedCoin,
          quantity: this.buyAmount,
          stopPrice: this.stopPriceBuy,
          leverage: this.currentLeverage,
          quantityPrecision: this.coinDataList[this.selectedCoin].precision

        }).subscribe((res: any) => {
          if (res.code === -2010) {
            this.isInsufficientFund = true;
            this.errMsg = 'Insufficient Fund';
          }
          else if (res.code === -2013) {
            this.isInsufficientFund = true;
            this.errMsg = 'Error Placing Order';
          }
          else if (res.code === -1013) {
            this.isInsufficientFund = true;
            this.errMsg = 'Amount Lower Than Minimun Limit';
          }
          else {
            this.isInsufficientFund = true;
            this.errMsg = res.msg;
          }
        }, (err: HttpErrorResponse) => {

        });
      }
    });

  }
  onInputChange(event: MatSliderChange) {
    this.currentLeverage = event.value;
    this.changeTotalPrice();
    this.changeTotalPriceSell();
  }
  sellLeverage() {
    if (this.currentLeverage > this.maxLev[this.selectedCoin]) {
      this.currentLeverage = this.maxLev[this.selectedCoin];
    }
    if (this.currentLeverage <= 0) {
      this.currentLeverage = 1;
    }
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.http.post(environment.Route + '/api/action/future-leverage', {

      symbol: this.selectedCoin,
      leverage: this.currentLeverage,


    }).subscribe((res: any) => {
      if (this.isStopLossSell && this.isLImitSell) {
        this.http.post(environment.Route + '/api/action/future-sell', {
          symbol: this.selectedCoin,
          quantity: this.sellAmount,
          price: this.sellAtPrice,
          stopPrice: this.stopPriceSell,
          leverage: this.currentLeverage,
          quantityPrecision: this.coinDataList[this.selectedCoin].precision

        }).subscribe((res: any) => {

          if (res.code === -2010) {
            this.isInsufficientFund2 = true;
            this.errMsg2 = 'Insufficient Fund';

          } else {
            this.isInsufficientFund2 = true;
            this.errMsg2 = 'Order Placed';
          }
        });
      } else if (!this.isStopLossSell && this.isLImitSell) {
        this.http.post(environment.Route + '/api/action/future-sell', {
          symbol: this.selectedCoin,
          quantity: this.sellAmount,
          price: this.sellAtPrice,
          quantityPrecision: this.coinDataList[this.selectedCoin].precision,


          leverage: this.currentLeverage
        }).subscribe((res: any) => {
          if (res.code === -2010) {
            this.isInsufficientFund2 = true;
            this.errMsg2 = 'Insufficient Fund';

          } else {
            this.isInsufficientFund2 = true;
            this.errMsg2 = 'Order Placed';
          }
        });
      } else if (this.isStopLossSell && !this.isLImitSell) {
        this.http.post(environment.Route + '/api/action/future-sell', {
          symbol: this.selectedCoin,
          quantity: this.sellAmount,
          stopPrice: this.stopPriceSell,
          leverage: this.currentLeverage,
          quantityPrecision: this.coinDataList[this.selectedCoin].precision

        }).subscribe((res: any) => {

          if (res.code === -2010) {
            this.isInsufficientFund2 = true;
            this.errMsg2 = 'Insufficient Fund';

          } else {
            this.isInsufficientFund2 = true;
            this.errMsg2 = 'Order Placed';
          }
        });
      } else if (!this.isStopLossSell && !this.isLImitSell) {
        this.http.post(environment.Route + '/api/action/future-sell', {
          symbol: this.selectedCoin,
          quantity: this.sellAmount,
          leverage: this.currentLeverage,
          quantityPrecision: this.coinDataList[this.selectedCoin].precision

        }).subscribe((res: any) => {

          if (res.code === -2010) {
            this.isInsufficientFund2 = true;
            this.errMsg2 = 'Insufficient Fund';

          } else {
            this.isInsufficientFund2 = true;
            this.errMsg2 = 'Order Placed';
          }
        });
      }

    }, (err: HttpErrorResponse) => {
      console.log(err.message);
    });
  }
  buy(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.isLimit) {
      console.log(this.buyAmount);
      this.isInsufficientFund = false;
      const symbol = this.getstockName(this.wathcList[this.index]);
      console.log(symbol);
      this.http.post(environment.Route + '/api/action/buy', {
        symbol: this.selectedCoin,
        quantity: this.buyAmount
      }).subscribe((res: any) => {

        if (res.code === -2010) {
          this.isInsufficientFund = true;
          this.errMsg = 'Insufficient Fund';
        }
        else if (res.code === -2013) {
          this.isInsufficientFund = true;
          this.errMsg = 'Error Placing Order';
        }
        else if (res.code === -1013) {
          this.isInsufficientFund = true;
          this.errMsg = 'Amount Lower Than Minimun Limit';
        }
        else {
          this.isInsufficientFund = true;
          this.errMsg = res.msg;
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.message);
      });
    } else if (this.isLimit) {
      console.log(this.buyAmount);
      this.isInsufficientFund = false;
      const symbol = this.getstockName(this.wathcList[this.index]);
      console.log(symbol);
      this.http.post(environment.Route + '/api/action/buy-limit', {
        symbol: this.selectedCoin,
        quantity: this.buyAmount,
        price: this.stopPriceBuy,

      }).subscribe((res: any) => {

        if (res.code === -2010) {
          this.isInsufficientFund = true;
          this.errMsg = 'Insufficient Fund';
        }
        else if (res.code === -2013) {
          this.isInsufficientFund = true;
          this.errMsg = 'Error Placing Order';
        }
        else if (res.code === -1013) {
          this.isInsufficientFund = true;
          this.errMsg = 'Amount Lower Than Minimun Limit';
        }
        else {
          this.isInsufficientFund = true;
          this.errMsg = 'Order Placed';
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.message);
      });
    }

  }
  sell(): void {
    if (!this.isLImitSell) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.sellStopLimitValue === 'LIMIT') {

      console.log('sell');
      const symbol = this.getstockName(this.wathcList[this.index]);
      this.http.post(environment.Route + '/api/action/sell', {
        symbol,
        quantity: this.sellAmount
      }).subscribe((res: any) => {

        if (res.code === -2010) {
          this.isInsufficientFund2 = true;
          this.errMsg2 = 'Insufficient Fund';

        } else {
          this.isInsufficientFund2 = true;
          this.errMsg2 = 'Order Placed';
        }

      }, (err: HttpErrorResponse) => {
        console.log(err.message);
      });
    } else if (this.isLImitSell) {

      console.log('sell');
      const symbol = this.getstockName(this.wathcList[this.index]);
      this.http.post(environment.Route + '/api/action/sell-limit', {
        symbol,
        quantity: this.sellAmount,
        price: this.stopPriceSell
      }).subscribe((res: any) => {

        if (res.code === -2010) {
          this.isInsufficientFund2 = true;
          this.errMsg2 = 'Insufficient Fund';

        } else {
          this.isInsufficientFund2 = true;
          this.errMsg2 = 'Order Placed';
        }

      }, (err: HttpErrorResponse) => {
        console.log(err.message);
      });
    }

  }
  toggleLimit() {
    this.isLimit = !this.isLimit;
    console.log(this.isLimit)
  }
  toggleStopLoss() {
    this.isStopLoss = !this.isStopLoss;
    console.log(this.isStopLoss)
  }
  toggleLimitSell() {
    this.isLImitSell = !this.isLImitSell;
    console.log(this.isLImitSell)
  }
  toggleStopLossSell() {
    this.isStopLossSell = !this.isStopLossSell;
    console.log(this.isStopLossSell);
  }
  clickLowestPrice() {
    this.buyAtPrice = this.coinDataList[this.selectedCoin].lastPrice;
  }
  clickHighestPrice() {
    this.sellAtPrice = this.coinDataList[this.selectedCoin].lastPrice;
  }
  closeOrder(symbol, ratio, quantityTotal) {
    // let qSell = Number(quantitySell);
    // let qTot = Number(quantityTotal);
    // qTot = Math.abs(qTot);
    // qSell = Math.abs(qSell);
    // const ratio = Math.round(qTot / qSell) * 100;
    console.log(this.coinDataList, this.selectedCoin);
    let precision = this.coinDataList[symbol].precision;
    console.log('PRecision', precision);
    let Side = '';
    let div = ratio / 100;
    if (quantityTotal.substring(0, 1) === '-') {
      Side = 'BUY'
    } else {
      Side = 'SELL'

    }
    let amountDec = quantityTotal * div;

    let quantity = Number(amountDec.toFixed(this.coinDataList[symbol].precision));
    console.log(quantity);

    console.log(this.coinDataList[symbol].precision);

    this.http.post(environment.Route + '/api/action/future-close-position', {
      symbol: symbol,
      quantity: Math.abs(quantity),
      side: Side,
      ratio: ratio,
      quantityPrecision: this.coinDataList[symbol].precision

    }).subscribe((res) => {

      this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res) => {
        if (res !== {}) {
          this.openOrders = res;
        }

      });
      this.http.get(environment.Route + '/api/action/future-positions').subscribe((res: any) => {

        this.positions = [];
        res.data.forEach(item => {
          if (item.entryPrice > 0) {
            this.positions.push(item);
            this.closePercentage.push(0.0);
          }
        });
        console.log(this.positions);

        if (res !== {}) {
          this.openOrders = (res);
        }

      });
    });

  }
  changeCurreny(data) {
    this.isUDST = false;
    this.isAUD = true;
    this.myWebSocket.next({
      method: 'SUBSCRIBE',
      params: [
        'eth' + data.toLowerCase() + '@aggTrade',
        'bnb' + data.toLowerCase() + '@aggTrade',
        'dot' + data.toLowerCase() + '@aggTrade',
        'btc' + data.toLowerCase() + '@aggTrade',
        'ada' + data.toLowerCase() + '@aggTrade',
        '1inch' + data.toLowerCase() + '@aggTrade',
        'algo' + data.toLowerCase() + '@aggTrade',
        'avax' + data.toLowerCase() + '@aggTrade',
        'bzrx' + data.toLowerCase() + '@aggTrade',
        'celr' + data.toLowerCase() + '@aggTrade',
        'crv' + data.toLowerCase() + '@aggTrade',
        'eos' + data.toLowerCase() + '@aggTrade',
        'flm' + data.toLowerCase() + '@aggTrade',
        'kava' + data.toLowerCase() + '@aggTrade',
        'lit' + data.toLowerCase() + '@aggTrade',
        'rlc' + data.toLowerCase() + '@aggTrade',
        'sxp' + data.toLowerCase() + '@aggTrade',
        'trx' + data.toLowerCase() + '@aggTrade',
        'uni' + data.toLowerCase() + '@aggTrade',
        'xlm' + data.toLowerCase() + '@aggTrade',
        'xrp' + data.toLowerCase() + '@aggTrade',
        'yfi' + data.toLowerCase() + '@aggTrade',
        'zrx' + data.toLowerCase() + '@aggTrade',
        'link' + data.toLowerCase() + '@aggTrade',
        'one' + data.toLowerCase() + '@aggTrade',

        'one' + data.toLowerCase() + '@ticker',
        'ada' + data.toLowerCase() + '@ticker',
        'eth' + data.toLowerCase() + '@ticker',
        'bnb' + data.toLowerCase() + '@ticker',
        'dot' + data.toLowerCase() + '@ticker',
        'btc' + data.toLowerCase() + '@ticker',
        '1inch' + data.toLowerCase() + '@ticker',
        'algo' + data.toLowerCase() + '@ticker',
        'avax' + data.toLowerCase() + '@ticker',
        'bzrx' + data.toLowerCase() + '@ticker',
        'celr' + data.toLowerCase() + '@ticker',
        'crv' + data.toLowerCase() + '@ticker',
        'eos' + data.toLowerCase() + '@ticker',
        'flm' + data.toLowerCase() + '@ticker',
        'kava' + data.toLowerCase() + '@ticker',
        'lit' + data.toLowerCase() + '@ticker',
        'rlc' + data.toLowerCase() + '@ticker',
        'sxp' + data.toLowerCase() + '@ticker',
        'trx' + data.toLowerCase() + '@ticker',
        'uni' + data.toLowerCase() + '@ticker',
        'xlm' + data.toLowerCase() + '@ticker',
        'xrp' + data.toLowerCase() + '@ticker',
        'yfi' + data.toLowerCase() + '@ticker',
        'zrx' + data.toLowerCase() + '@ticker',
        'link' + data.toLowerCase() + '@ticker',


      ],
      id: 1
    });
    this.myWebSocket.subscribe((message: any) => {
      if (data === 'USDT') {

        if (message.e === 'aggTrade') {
          if (message.s === 'ETHUSDT' && this.coinDataList.ETHUSDT !== undefined) {
            this.coinDataList.ETHUSDT.lastPrice = message.p;
          }
          if (message.s === 'LINKUSDT' && this.coinDataList.LINKUSDT !== undefined) {
            this.coinDataList.LINKUSDT.lastPrice = message.p;
          }
          if (message.s === 'YFIUSDT' && this.coinDataList.YFIUSDT !== undefined) {
            this.coinDataList.YFIUSDT.lastPrice = message.p;
          }
          if (message.s === 'ZRXUSDT' && this.coinDataList.ZRXUSDT !== undefined) {
            this.coinDataList.ZRXUSDT.lastPrice = message.p;
          }
          if (message.s === 'XRPUSDT' && this.coinDataList.XRPUSDT !== undefined) {
            this.coinDataList.XRPUSDT.lastPrice = message.p;
          }
          if (message.s === 'SXPUSDT' && this.coinDataList.SXPUSDT !== undefined) {
            this.coinDataList.SXPUSDT.lastPrice = message.p;
          }
          if (message.s === 'UNIUSDT' && this.coinDataList.UNIUSDT !== undefined) {
            this.coinDataList.UNIUSDT.lastPrice = message.p;
          }
          if (message.s === 'KAVAUSDT' && this.coinDataList.KAVAUSDT !== undefined) {
            this.coinDataList.KAVAUSDT.lastPrice = message.p;
          }
          if (message.s === 'XLMUSDT' && this.coinDataList.XLMUSDT !== undefined) {
            this.coinDataList.XLMUSDT.lastPrice = message.p;
          }
          if (message.s === 'FLMUSDT' && this.coinDataList.FLMUSDT !== undefined) {
            this.coinDataList.FLMUSDT.lastPrice = message.p;
          }
          if (message.s === 'CRVUSDT' && this.coinDataList.CRVUSDT !== undefined) {
            this.coinDataList.CRVUSDT.lastPrice = message.p;
          }
          if (message.s === 'LITUSDT' && this.coinDataList.LITUSDT !== undefined) {
            this.coinDataList.LITUSDT.lastPrice = message.p;
          }
          if (message.s === 'EOSUSDT' && this.coinDataList.EOSUSDT !== undefined) {
            this.coinDataList.EOSUSDT.lastPrice = message.p;
          }
          if (message.s === 'CELRUSDT' && this.coinDataList.CELRUSDT !== undefined) {
            this.coinDataList.CELRUSDT.lastPrice = message.p;
          }
          if (message.s === 'BZRXUSDT' && this.coinDataList.BZRXUSDT !== undefined) {
            this.coinDataList.BZRXUSDT.lastPrice = message.p;
          }
          if (message.s === 'BNBUSD' && this.coinDataList.BNBUSD !== undefined) {
            this.coinDataList.BNBUSD.lastPrice = message.p;
          }
          if (message.s === 'ALGOUSDT' && this.coinDataList.ALGOUSDT !== undefined) {
            this.coinDataList.ALGOUSDT.lastPrice = message.p;
          }
          if (message.s === 'ADAUSDT' && this.coinDataList.ADAUSDT !== undefined) {
            this.coinDataList.ADAUSDT.lastPrice = message.p;
          }
          if (message.s === 'BTCUSDT' && this.coinDataList.BTCUSDT !== undefined) {
            this.coinDataList.BTCUSDT.lastPrice = message.p;
          }
          if (message.s === '1INCHUSDT' && this.coinDataList['1INCHUSDT'] !== undefined) {
            this.coinDataList['1INCHUSDT'].lastPrice = message.p;
          }
          if (message.s === 'AVAXUSDT' && this.coinDataList['AVAXUSDT'] !== undefined) {
            this.coinDataList['AVAXUSDT'].lastPrice = message.p;
          }

          if (message.s === 'CHZUSDT' && this.coinDataList.CHZUSDT !== undefined) {
            this.coinDataList.CHZUSDT.lastPrice = message.p;
          }
          if (message.s === 'ONEUSDT' && this.coinDataList.ONEUSDT !== undefined) {
            this.coinDataList.ONEUSDT.lastPrice = message.p;
          }
          if (message.s === 'DOGEUSDT' && this.coinDataList.DOGEUSDT !== undefined) {
            this.coinDataList.DOGEUSDT.lastPrice = message.p;
          }
          if (message.s === 'DOTUSDT' && this.coinDataList.DOTUSDT !== undefined) {
            this.coinDataList.DOTUSDT.lastPrice = message.p;
          }
          if (message.s === 'ENJUSDT' && this.coinDataList.ENJUSDT !== undefined) {
            this.coinDataList.ENJUSDT.lastPrice = message.p;
          }
          if (message.s === 'DENTUSDT' && this.coinDataList.DENTUSDT !== undefined) {
            this.coinDataList.DENTUSDT.lastPrice = message.p;
          }
          if (message.s === 'EGLDUSDT' && this.coinDataList.EGLDUSDT !== undefined) {
            this.coinDataList.EGLDUSDT.lastPrice = message.p;
          }
          if (message.s === 'ONTUSDT' && this.coinDataList.ONTUSDT !== undefined) {
            this.coinDataList.ONTUSDT.lastPrice = message.p;
          }
          if (message.s === 'RLCUSDT' && this.coinDataList.RLCUSDT !== undefined) {
            this.coinDataList.RLCUSDT.lastPrice = message.p;
          }
          if (message.s === 'TRXUSDT' && this.coinDataList.TRXUSDT !== undefined) {
            this.coinDataList.TRXUSDT.lastPrice = message.p;
          }
        }
        if (message.e === '24hrTicker') {

          if (message.s === 'ETHUSDT' && this.coinDataList.ETHUSDT !== undefined) {
            this.coinDataList.ETHUSDT.priceChangePercent = message.P;
            this.coinDataList.ETHUSDT.priceChange = message.p;
            if (this.coinDataList.ETHUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.ETHUSDT.volume.shift();
                this.coinDataList.ETHUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.ETHUSDT.volume.shift();
                this.coinDataList.ETHUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.ETHUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.ETHUSDT.volume.push(history);

              }

            }
          }
          if (message.s === 'YFIUSDT' && this.coinDataList.YFIUSDT !== undefined) {
            this.coinDataList.YFIUSDT.priceChangePercent = message.P;
            this.coinDataList.YFIUSDT.priceChange = message.p;
            if (this.coinDataList.YFIUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.YFIUSDT.volume.shift();
                this.coinDataList.YFIUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.YFIUSDT.volume.shift();
                this.coinDataList.YFIUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.YFIUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.YFIUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'LINKUSDT' && this.coinDataList.LINKUSDT !== undefined) {
            this.coinDataList.LINKUSDT.priceChangePercent = message.P;
            this.coinDataList.LINKUSDT.priceChange = message.p;
            if (this.coinDataList.LINKUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.LINKUSDT.volume.shift();
                this.coinDataList.LINKUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.LINKUSDT.volume.shift();
                this.coinDataList.LINKUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.LINKUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.LINKUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'ZRXUSDT' && this.coinDataList.ZRXUSDT !== undefined) {
            this.coinDataList.ZRXUSDT.priceChange = message.p;
            if (this.coinDataList.ZRXUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.ZRXUSDT.volume.shift();
                this.coinDataList.ZRXUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.ZRXUSDT.volume.shift();
                this.coinDataList.ZRXUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.ZRXUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.ZRXUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'UNIUSDT' && this.coinDataList.UNIUSDT !== undefined) {
            this.coinDataList.UNIUSDT.priceChangePercent = message.P;
            this.coinDataList.UNIUSDT.priceChange = message.p;
            if (this.coinDataList.UNIUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.UNIUSDT.volume.shift();
                this.coinDataList.UNIUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.UNIUSDT.volume.shift();
                this.coinDataList.UNIUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.UNIUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.UNIUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'XRPUSDT' && this.coinDataList.XRPUSDT !== undefined) {
            this.coinDataList.XRPUSDT.priceChangePercent = message.P;
            this.coinDataList.XRPUSDT.priceChange = message.p;
            if (this.coinDataList.XRPUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.XRPUSDT.volume.shift();
                this.coinDataList.XRPUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.XRPUSDT.volume.shift();
                this.coinDataList.XRPUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.XRPUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.XRPUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'TRXUSDT' && this.coinDataList.TRXUSDT !== undefined) {
            this.coinDataList.TRXUSDT.priceChangePercent = message.P;
            this.coinDataList.TRXUSDT.priceChange = message.p;
            if (this.coinDataList.TRXUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.TRXUSDT.volume.shift();
                this.coinDataList.TRXUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.TRXUSDT.volume.shift();
                this.coinDataList.TRXUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.TRXUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.TRXUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'XLMUSDT' && this.coinDataList.XLMUSDT !== undefined) {
            this.coinDataList.XLMUSDT.priceChangePercent = message.P;
            this.coinDataList.XLMUSDT.priceChange = message.p;
            if (this.coinDataList.XLMUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.XLMUSDT.volume.shift();
                this.coinDataList.XLMUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.XLMUSDT.volume.shift();
                this.coinDataList.XLMUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.XLMUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.XLMUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'SXPUSDT' && this.coinDataList.SXPUSDT !== undefined) {
            this.coinDataList.SXPUSDT.priceChangePercent = message.P;
            this.coinDataList.SXPUSDT.priceChange = message.p;
            if (this.coinDataList.SXPUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.SXPUSDT.volume.shift();
                this.coinDataList.SXPUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.SXPUSDT.volume.shift();
                this.coinDataList.SXPUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.SXPUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.SXPUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'RLCUSDT' && this.coinDataList.RLCUSDT !== undefined) {
            this.coinDataList.RLCUSDT.priceChangePercent = message.P;
            this.coinDataList.RLCUSDT.priceChange = message.p;
            if (this.coinDataList.RLCUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.RLCUSDT.volume.shift();
                this.coinDataList.RLCUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.RLCUSDT.volume.shift();
                this.coinDataList.RLCUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.RLCUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.RLCUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'ONEUSDT' && this.coinDataList.ONEUSDT !== undefined) {
            this.coinDataList.ONEUSDT.priceChangePercent = message.P;
            this.coinDataList.ONEUSDT.priceChange = message.p;
            if (this.coinDataList.ONEUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.ONEUSDT.volume.shift();
                this.coinDataList.ONEUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.ONEUSDT.volume.shift();
                this.coinDataList.ONEUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.ONEUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.ONEUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'LITUSDT' && this.coinDataList.LITUSDT !== undefined) {
            this.coinDataList.LITUSDT.priceChangePercent = message.P;
            this.coinDataList.LITUSDT.priceChange = message.p;
            if (this.coinDataList.LITUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.LITUSDT.volume.shift();
                this.coinDataList.LITUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.LITUSDT.volume.shift();
                this.coinDataList.LITUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.LITUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.LITUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'KAVAUSDT' && this.coinDataList.KAVAUSDT !== undefined) {
            this.coinDataList.KAVAUSDT.priceChangePercent = message.P;
            this.coinDataList.KAVAUSDT.priceChange = message.p;
            if (this.coinDataList.KAVAUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.KAVAUSDT.volume.shift();
                this.coinDataList.KAVAUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.KAVAUSDT.volume.shift();
                this.coinDataList.KAVAUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.KAVAUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.KAVAUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'FLMUSDT' && this.coinDataList.FLMUSDT !== undefined) {
            this.coinDataList.FLMUSDT.priceChangePercent = message.P;
            this.coinDataList.FLMUSDT.priceChange = message.p;
            if (this.coinDataList.FLMUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.FLMUSDT.volume.shift();
                this.coinDataList.FLMUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.FLMUSDT.volume.shift();
                this.coinDataList.FLMUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.FLMUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.FLMUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'EOSUSDT' && this.coinDataList.EOSUSDT !== undefined) {
            this.coinDataList.EOSUSDT.priceChangePercent = message.P;
            this.coinDataList.EOSUSDT.priceChange = message.p;
            if (this.coinDataList.EOSUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.EOSUSDT.volume.shift();
                this.coinDataList.EOSUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.EOSUSDT.volume.shift();
                this.coinDataList.EOSUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.EOSUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.EOSUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'CELRUSDT' && this.coinDataList.CELRUSDT !== undefined) {
            this.coinDataList.CELRUSDT.priceChangePercent = message.P;
            this.coinDataList.CELRUSDT.priceChange = message.p;
            if (this.coinDataList.CELRUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.CELRUSDT.volume.shift();
                this.coinDataList.CELRUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.CELRUSDT.volume.shift();
                this.coinDataList.CELRUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.CELRUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.CELRUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'CRVUSDT' && this.coinDataList.CRVUSDT !== undefined) {
            this.coinDataList.CRVUSDT.priceChangePercent = message.P;
            this.coinDataList.CRVUSDT.priceChange = message.p;
            if (this.coinDataList.CRVUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.CRVUSDT.volume.shift();
                this.coinDataList.CRVUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.CRVUSDT.volume.shift();
                this.coinDataList.CRVUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.CRVUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.CRVUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'BZRXUSDT' && this.coinDataList.BZRXUSDT !== undefined) {
            this.coinDataList.BZRXUSDT.priceChangePercent = message.P;
            this.coinDataList.BZRXUSDT.priceChange = message.p;
            if (this.coinDataList.BZRXUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.BZRXUSDT.volume.shift();
                this.coinDataList.BZRXUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.BZRXUSDT.volume.shift();
                this.coinDataList.BZRXUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.BZRXUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.BZRXUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'BNBUSD' && this.coinDataList.BNBUSD !== undefined) {
            this.coinDataList.BNBUSD.priceChangePercent = message.P;
            this.coinDataList.BZRXUSDT.priceChange = message.p;

            if (this.coinDataList.BZRXUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.BZRXUSDT.volume.shift();
                this.coinDataList.BZRXUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.BZRXUSDT.volume.shift();
                this.coinDataList.BZRXUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.BZRXUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.BZRXUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'ALGOUSDT' && this.coinDataList.ALGOUSDT !== undefined) {
            this.coinDataList.ALGOUSDT.priceChangePercent = message.P;
            this.coinDataList.ALGOUSDT.priceChange = message.p;


            if (this.coinDataList.ALGOUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.ALGOUSDT.volume.shift();
                this.coinDataList.ALGOUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.ALGOUSDT.volume.shift();
                this.coinDataList.ALGOUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.ALGOUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.ALGOUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'AVAXUSDT' && this.coinDataList.AVAXUSDT !== undefined) {
            this.coinDataList.AVAXUSDT.priceChangePercent = message.P;
            this.coinDataList.AVAXUSDT.priceChange = message.p;
            if (this.coinDataList.AVAXUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.AVAXUSDT.volume.shift();
                this.coinDataList.AVAXUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.AVAXUSDT.volume.shift();
                this.coinDataList.AVAXUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.AVAXUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.AVAXUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'CHZUSDT' && this.coinDataList.CHZUSDT !== undefined) {
            this.coinDataList.CHZUSDT.priceChangePercent = message.P;
            this.coinDataList.CHZUSDT.priceChange = message.p;

            if (this.coinDataList.CHZUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.CHZUSDT.volume.shift();
                this.coinDataList.CHZUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.CHZUSDT.volume.shift();
                this.coinDataList.CHZUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.CHZUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.CHZUSDT.volume.push(history);

              }
            }

          }
          if (message.s === '1INCHUSDT' && this.coinDataList['1INCHUSDT'] !== undefined) {
            this.coinDataList['1INCHUSDT'].priceChangePercent = message.P;
            this.coinDataList['1INCHUSDT'].priceChange = message.p;
            if (this.coinDataList['1INCHUSDT'].volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList['1INCHUSDT'].volume.shift();
                this.coinDataList['1INCHUSDT'].volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList['1INCHUSDT'].volume.shift();
                this.coinDataList['1INCHUSDT'].volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList['1INCHUSDT'].volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList['1INCHUSDT'].volume.push(history);

              }
            }
          }
          if (message.s === 'DOGEUSDT' && this.coinDataList.DOGEUSDT !== undefined) {
            this.coinDataList.DOGEUSDT.priceChangePercent = message.P;
            this.coinDataList.DOGEUSDT.priceChange = message.p;

            if (this.coinDataList['DOGEUSDT'].volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList['DOGEUSDT'].volume.shift();
                this.coinDataList['DOGEUSDT'].volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList['DOGEUSDT'].volume.shift();
                this.coinDataList['DOGEUSDT'].volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList['DOGEUSDT'].volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList['DOGEUSDT'].volume.push(history);

              }
            }
          }
          if (message.s === 'DOTUSDT' && this.coinDataList.DOTUSDT !== undefined) {
            this.coinDataList.DOTUSDT.priceChangePercent = message.P;
            this.coinDataList.DOTUSDT.priceChange = message.p;
            if (this.coinDataList.DOTUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.DOTUSDT.volume.shift();
                this.coinDataList.DOTUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.DOTUSDT.volume.shift();
                this.coinDataList.DOTUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.DOTUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.DOTUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'DENTUSDT' && this.coinDataList.DENTUSDT !== undefined) {
            this.coinDataList.DENTUSDT.priceChangePercent = message.P;
            this.coinDataList.DENTUSDT.priceChange = message.p;

            if (this.coinDataList.DENTUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.DENTUSDT.volume.shift();
                this.coinDataList.DENTUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.DENTUSDT.volume.shift();
                this.coinDataList.DENTUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.DENTUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.DENTUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'EGLDUSDT' && this.coinDataList.EGLDUSDT !== undefined) {
            this.coinDataList.EGLDUSDT.priceChangePercent = message.P;
            this.coinDataList.EGLDUSDT.priceChange = message.p;

            if (this.coinDataList.EGLDUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.EGLDUSDT.volume.shift();
                this.coinDataList.EGLDUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.EGLDUSDT.volume.shift();
                this.coinDataList.EGLDUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.EGLDUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.EGLDUSDT.volume.push(history);

              }
            }
          }
          if (message.s === 'ONTUSDT' && this.coinDataList.ONTUSDT !== undefined) {
            this.coinDataList.ONTUSDT.priceChangePercent = message.P;
            this.coinDataList.ONTUSDT.priceChange = message.p;

            if (this.coinDataList.ONTUSDT.volume.length === 12) {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.ONTUSDT.volume.shift();
                this.coinDataList.ONTUSDT.volume.push(history);
              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.ONTUSDT.volume.shift();
                this.coinDataList.ONTUSDT.volume.push(history);
              }


            } else {
              if (!this.isFuture) {
                const history = {
                  buyVolume: message.B,
                  buPrice: message.b,
                  sellVolume: message.A,
                  sellPrice: message.a
                }
                this.coinDataList.ONTUSDT.volume.push(history);

              } else {
                const history = {
                  buyVolume: message.Q,
                  buPrice: message.c,

                }
                this.coinDataList.ONTUSDT.volume.push(history);

              }
            }
          }
        }

      }
    }, error => {
      console.error(error); // handle errors
    }, () => console.log('complete'));
  }

}


@Component({
  selector: 'dialog-trade',
  templateUrl: 'dialog-trade.html',
  styleUrls: ['trading.component.css']
})
export class DialogTrade {
  constructor(public dialogRef: MatDialogRef<DialogTrade>) { }
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
  constructor(public dialogRef: MatDialogRef<DialogSell>) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
