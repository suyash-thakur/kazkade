import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { webSocket } from 'rxjs/webSocket';
import { AuthService } from '../shared/auth.service';
import { environment } from 'src/environments/environment';
import { MatSliderChange } from '@angular/material/slider';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
declare const TradingView: any;

@Component({
  selector: 'app-trading-market',
  templateUrl: './trading-market.component.html',
  styleUrls: ['./trading-market.component.css']
})

export class TradingMarketComponent implements OnInit, AfterViewInit {
  @Output()
  emitFunctionOfParent: EventEmitter<any> = new EventEmitter<any>();
  selectedCoin: any;
  currentCurrency = 'USDT';
  filteredOptions: Observable<string[]>;
  myWebSocket = webSocket('wss://stream.binance.com:9443/ws');
  temp;
  buyAtPriceSpot: number;
  buyAtPriceLimit: number;
  sellAtPriceLimit: number;
  marginBalace: number = 0;
  marginRatio: number = 0;
  availableBalance: any;
  isReduceOnly = false;
  isLimit = false;
  isLImitSell = false;
  isMarket = true;
  isMarketSell = true;
  currentLeverage = 1;
  highPrice = 0;
  lowPrice = 0;
  volCoin = 0;
  volUsdt = 0;
  stopPriceTotal = 0;
  coinInput;
  marketType = 'Future';
  status = [];
  isStopLoss = false;
  isStopLossSell = false;
  isLImitLoaded = false;
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
  limitOpenOrders = [];
  completedOrders = [];
  closePercentage = [];
  limitPricePosition = [];
  limitQuantityPosition = [];
  limitAsset = [];

  coinDataList: any = {};
  selectedCoinSocket: any;
  marginPrice = 0.00;
  positions = [];
  buyAmount: any = 0;
  buyAtPrice = 0;
  sellAtPrice = 0
  coinLevrage = 0;
  isFuture = true;
  isIsolated = true;
  errMsgBuy = '';
  myControl = new FormControl();

  width = 0;
  index = 0;
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
  wathcListFuture: Array<any> = [
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
  wathlistSpot: Array<any> = [

    "BINANCE:BTC" + this.currentCurrency,

    "BINANCE:ETH" + this.currentCurrency,

    "BINANCE:BNB" + this.currentCurrency,

    "BINANCE:XRP" + this.currentCurrency,

    "BINANCE:DOGE" + this.currentCurrency,

    "BINANCE:ADA" + this.currentCurrency,


    "BINANCE:BCH" + this.currentCurrency,

    "BINANCE:LTC" + this.currentCurrency,

    "BINANCE:LINK" + this.currentCurrency,

    "BINANCE:XLM" + this.currentCurrency,

    "BINANCE:VET" + this.currentCurrency,

    "BINANCE:THETA" + this.currentCurrency,

    "BINANCE:IOTA" + this.currentCurrency,

    "BINANCE:ETC" + this.currentCurrency,


    "BINANCE:ATOM" + this.currentCurrency,

    "BINANCE:ALGO" + this.currentCurrency,

    "BINANCE:MKR" + this.currentCurrency,

    "BINANCE:XTZ" + this.currentCurrency,

    "BINANCE:DASH" + this.currentCurrency,

    "BINANCE:XEM" + this.currentCurrency,

    "BINANCE:MATIC" + this.currentCurrency

  ];
  sortedData: any[];
  constructor(private router: Router,
    private route: ActivatedRoute, private cdRef: ChangeDetectorRef,
    public authService: AuthService, public http: HttpClient, public dialog: MatDialog) {

    this.route.params.subscribe((params) => {

      console.log(params.coin);
      this.selectedCoin = params.coin;
      this.completedOrders = [];
      this.limitOpenOrders = [];
      this.positions = [];
      this.openOrders = {};
      this.isLoaded = false;


      this.myWebSocket.unsubscribe();
      if (params.market === 'future') {
        this.isFuture = true;
        this.wathcList = this.wathcListFuture;
        this.myWebSocket = webSocket('wss://fstream.binance.com/ws');


      } else {
        this.currentLeverage = 1;
        this.isFuture = false;
        this.wathcList = this.wathlistSpot;
        this.myWebSocket = webSocket('wss://stream.binance.com:9443/ws');

      }
      this.selectedCoinSocket = this.selectedCoin.replace('USDT', '').toLowerCase();

      console.log(this.selectedCoinSocket)

      this.myWebSocket.next({
        method: 'SUBSCRIBE',
        params: [
          this.selectedCoinSocket + 'usdt' + '@aggTrade',
          this.selectedCoinSocket + 'usdt' + '@ticker',

        ],
        id: 1
      });
      this.subscribewebsocket()

      this.width = window.innerWidth;
      this.chartWidth = this.width * 0.7;
      this.http.get('https://fapi.binance.com/fapi/v1/exchangeInfo').subscribe((res: any) => {
        let number1 = 0;
        const number2 = 0;
        console.log(res);

        res.symbols.forEach(async (item: any, index, array) => {
          if (this.wathcList.indexOf('BINANCE:' + item.symbol) > -1) {
            console.log(item);

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
            this.http.get('https://fapi.binance.com/fapi/v1/exchangeInfo').subscribe((res: any) => {
              res.symbols.forEach((item) => {
                if (this.wathcList.indexOf('BINANCE:' + item.symbol) > -1) {
                  this.coinDataList[item.symbol].precision = item.quantityPrecision;
                }

              })
            });
            this.buyAtPrice = this.coinDataList[this.selectedCoin].lastPrice;
            this.buyAtPriceSpot = this.coinDataList[this.selectedCoin].lastPrice;
            this.sellAtPrice = this.coinDataList[this.selectedCoin].lastPrice;
            this.sellAtPriceLimit = this.coinDataList[this.selectedCoin].lastPrice;
            console.log("THis is called");
            const sortedKeys = Object.keys(this.coinDataList).sort();
            let temp = {};
            sortedKeys.forEach(elem => {
              console.log(elem);
              temp[elem] = this.coinDataList[elem]; // yuo should see sorted output: A, B, C
            });
            this.coinDataList = temp;
            this.isLoaded = true;

          }

        }

        );

        if (this.authService.isLoggedIn === true) {

          if (this.isFuture) {
            this.http.post(environment.Route + '/api/action/future-margin-type', { symbol: this.selectedCoin, type: "ISOLATED" }).subscribe((res) => {
              console.log(res);
            });
            this.http.get(environment.Route + '/api/action/future-all-orders').subscribe((res: any) => {
              if (res !== {}) {
                console.log(res);

                this.completedOrders = (res.data);
                this.completedOrders.reverse();
              }

            });
            this.http.get(environment.Route + '/api/action/future-account').subscribe((res: any) => {
              console.log(res);
              this.availableBalance = res.data.availableBalance;
              res.data.positions.forEach(item => {



                if (item.symbol === this.selectedCoin) {
                  if (item.isolated) {
                    this.marginBalace = Number((Number(item.isolatedWallet) + Number(item.unrealizedProfit)).toFixed(3));

                  } else {
                    this.marginBalace = Number((Number(res.data.totalCrossWalletBalance) + Number(item.unrealizedProfit)).toFixed(3));

                  }

                  this.marginPrice = Number(Number(item.maintMargin).toFixed(3));
                  if (Number(this.marginBalace) !== 0) {
                    console.log(this.marginBalace);
                    console.log(Number(this.marginBalace));

                    this.marginRatio = Number(((this.marginPrice / this.marginBalace) * 100).toFixed(3));
                  } else {
                    this.marginRatio = 0;
                  }
                }
              });

              if (res !== {}) {
                this.openOrders = (res.data.positions);
              }

            });
            this.http.get(environment.Route + '/api/action/future-positions').subscribe((res: any) => {
              console.log(res);
              res.data.forEach(item => {
                if (item.entryPrice > 0) {
                  this.positions.push(item);
                  this.positions.reverse();
                  this.closePercentage.push(0.0);
                  this.closePercentage.reverse();
                  this.limitPricePosition.push(0.0);
                  this.limitQuantityPosition.push(0.0);
                }
              });
            })

            this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res: any) => {
              console.log(res);
              if (res !== {}) {
                this.limitOpenOrders = res.data;

              }
            });
          } else {
            this.http.get(environment.Route + '/api/action/completed-orders').subscribe((res: any) => {
              console.log(res);
              console.log("Open orders", res);
              if (res !== {}) {
                this.completedOrders = res.reverse();

              }
            });
            this.http.get(environment.Route + '/api/action/openOrders').subscribe((res: any) => {
              console.log(res);
              if (res !== {}) {
                this.limitOpenOrders = res.data;

              }
            });
            this.http.get<any>(environment.Route + '/api/user/user-balance').subscribe((res: any) => {
              console.log(res);
              this.limitAsset = [];
              res.forEach((data: any) => {
                if (data.asset === 'USDT') {
                  this.availableBalance = Math.abs(Number(data.free));
                }
                this.limitAsset.push({
                  name: data.asset,
                  value: Math.abs(Number(data.free))
                });
                console.log(this.limitAsset);

              });
            });
          }


        }

      });
    });
  }
  toggleReduceOnly() {
    this.isReduceOnly = !this.isReduceOnly;
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

  }
  cancelOrderLimit(i) {
    this.http.post(environment.Route + '/api/action/cancle-order', this.limitOpenOrders[i]).subscribe((res) => {
      this.http.get(environment.Route + '/api/action/openOrders').subscribe((res: any) => {
        console.log(res);
        if (res !== {}) {
          this.limitOpenOrders = [];
          this.limitOpenOrders = res.data;

        }
      });
      this.http.get<any>(environment.Route + '/api/user/user-balance').subscribe((res: any) => {
        console.log(res);
        this.limitAsset = [];
        if (res.asset === 'USDT') {
          this.availableBalance = Math.abs(Number(res.free));
        }
        res.forEach((data: any) => {
          this.limitAsset.push({
            name: data.asset,
            value: Math.abs(Number(data.free))
          });
          console.log(this.limitAsset);

        });
      });
    });
  }
  cancelOrder(i) {
    this.http.post(environment.Route + '/api/action/future-cancle-order', this.limitOpenOrders[i]).subscribe((res) => {
      this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res: any) => {
        if (res !== {}) {
          this.limitOpenOrders = res.data;
        }
      });
      this.http.get(environment.Route + '/api/action/future-account').subscribe((res: any) => {
        console.log(res);
        this.availableBalance = res.data.availableBalance;

      });
    });
  }
  toggleMarket() {
    this.isMarket = !this.isMarket;
  }
  toggleMarketSell() {
    this.isMarketSell = !this.isMarketSell;
    console.log(this.isMarketSell)

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
    this.buyAtPriceSpot = this.coinDataList[this.selectedCoin].lastPrice;
  }
  clickHighestPrice() {
    this.sellAtPriceLimit = this.coinDataList[this.selectedCoin].lastPrice;
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
    if (!this.isFuture) {
      if (this.isLimit === false) {
        this.buyTotalPrice = this.buyAmount * this.coinDataList[this.selectedCoin].lastPrice;

      } else {
        this.buyTotalPrice = this.buyAmount * this.buyAtPriceSpot;

      }

    } else {
      if (this.isLimit === true) {
        console.log(this.buyAtPriceLimit);
        this.buyTotalPrice = (this.buyAmount * this.buyAtPriceLimit) / this.currentLeverage;
      } else {
        this.buyTotalPrice = (this.buyAmount * this.coinDataList[this.selectedCoin].lastPrice) / this.currentLeverage;

      }
    }
    this.changeStopPriceTotalBuy();
  }
  changeStopPriceTotalBuy() {
    this.stopPriceTotal = (this.stopPriceBuy * this.buyAmount) / this.currentLeverage;
  }
  changeStopPriceTotalSell() {
    this.stopPriceTotal = (this.stopPriceSell * this.sellAmount) / this.currentLeverage;
  }
  changeSellAmount() {
    let amountDec = this.sellTotalPrice / this.coinDataList[this.selectedCoin].lastPrice;

    this.sellAmount = amountDec.toFixed(this.coinDataList[this.selectedCoin].precision);
  }
  changeTotalPriceSell() {
    if (this.marketType !== 'Future') {
      if (this.isLImitSell === false) {

        this.sellTotalPrice = this.sellAmount * this.coinDataList[this.selectedCoin].lastPrice;
      } else {
        this.sellTotalPrice = this.sellAmount * this.sellAtPriceLimit;

      }

    } else {
      console.log(this.sellAtPriceLimit);

      if (this.isLImitSell === true) {

        this.sellTotalPrice = (this.sellAmount * this.sellAtPriceLimit) / this.currentLeverage;
      } else {
        this.sellTotalPrice = (this.sellAmount * this.coinDataList[this.selectedCoin].lastPrice) / this.currentLeverage;

      }
    }
    this.changeStopPriceTotalSell();

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
      if (!this.isLimit && !this.isStopLoss && this.isMarket) {

        this.http.post(environment.Route + '/api/action/future-buy', {
          symbol: this.selectedCoin,
          quantity: this.buyAmount,
          leverage: this.currentLeverage,
          quantityPrecision: this.coinDataList[this.selectedCoin].precision,
          reduceOnly: this.isReduceOnly

        }).subscribe((res: any) => {
          this.authService.sendClickEvent();

          this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res: any) => {
            this.limitOpenOrders = [];
            console.log(res);
            if (res !== {}) {
              this.limitOpenOrders = res.data;
            }
          });
          this.http.get(environment.Route + '/api/action/future-account').subscribe((res: any) => {
            this.availableBalance = res.data.availableBalance;
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
            this.positions.reverse();


            if (res !== {}) {
              this.openOrders = (res);
            }

          });
          if (res.data.code === -2010) {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Insufficient Fund';
          }
          else if (res.data.code === -2013) {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Error Placing Order';
          }
          else if (res.data.code === -1013) {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Amount Lower Than Minimun Limit';
          } else if (res.data.code === -4164) {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Order notional must be no smaller than 5.0 (unless you choose reduce only';
          }
          else {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Order Placed';
          }
        }, (err: HttpErrorResponse) => {

        });
      }
      else if (this.isLimit && !this.isStopLoss && !this.isMarket) {
        this.http.post(environment.Route + '/api/action/future-limit', {
          symbol: this.selectedCoin,
          quantity: this.buyAmount,
          price: this.buyAtPriceLimit,
          leverage: this.currentLeverage,
          reduceOnly: this.isReduceOnly,
          quantityPrecision: this.coinDataList[this.selectedCoin].precision,
          side: 'BUY'

        }).subscribe((res: any) => {
          this.authService.sendClickEvent();

          this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res: any) => {
            console.log(res);
            if (res !== {}) {
              this.limitOpenOrders = res.data;
            }
          });
          this.http.get(environment.Route + '/api/action/future-account').subscribe((res: any) => {
            this.availableBalance = res.data.availableBalance;
          });
          if (res.data.code === -2010) {
            this.isInsufficientFund = true;
            this.errMsg = 'Insufficient Fund';
          }
          else if (res.data.code === -2013) {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Error Placing Order';
          } else if (res.data.code === -4164) {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Order notional must be no smaller than 5.0 (unless you choose reduce only';
          }
          else if (res.data.code === -1013) {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Amount Lower Than Minimun Limit';
          }
          else {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Order Placed';
          }
        }, (err: HttpErrorResponse) => {

        });
        this.http.get(environment.Route + '/api/action/future-positions').subscribe((res: any) => {

          this.positions = [];
          res.data.forEach(item => {
            if (item.entryPrice > 0) {
              this.positions.push(item);
              this.closePercentage.push(0.0);
            }
            this.positions.reverse();
          });
          console.log(this.positions);

          if (res !== {}) {
            this.openOrders = (res);
          }

        });
      }
      else if (!this.isLimit && this.isStopLoss && !this.isMarket) {
          this.http.post(environment.Route + '/api/action/future-stop-loss', {
            symbol: this.selectedCoin,
            quantity: this.buyAmount,
            stopPrice: this.stopPriceBuy,
            leverage: this.currentLeverage,
            reduceOnly: this.isReduceOnly,
            quantityPrecision: this.coinDataList[this.selectedCoin].precision,
            ratio: 100,
            side: 'BUY'


          }).subscribe((res: any) => {
            this.authService.sendClickEvent();

            this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res: any) => {
              this.limitOpenOrders = [];
              console.log(res);
              if (res !== {}) {
                this.limitOpenOrders = res.data;
              }
            });
            this.http.get(environment.Route + '/api/action/future-account').subscribe((res: any) => {
              this.availableBalance = res.data.availableBalance;
            });
            this.http.get(environment.Route + '/api/action/future-positions').subscribe((res: any) => {

              this.positions = [];
              res.data.forEach(item => {
                if (item.entryPrice > 0) {
                  this.positions.push(item);
                  this.closePercentage.push(0.0);
                }
              });
              this.positions.reverse();

              console.log(this.positions);

              if (res !== {}) {
                this.openOrders = (res);
              }

            });
          }, (err: HttpErrorResponse) => {

          });
        if (res.data.code === -2010) {
            this.isInsufficientFund = true;
            this.errMsg = 'Insufficient Fund';
          }
        else if (res.data.code === -2013) {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Error Placing Order';
          }
        else if (res.data.code === -1013) {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Amount Lower Than Minimun Limit';
        } else if (res.data.code === -4164) {
          this.isInsufficientFund = true;
          this.errMsgBuy = 'Order notional must be no smaller than 5.0 (unless you choose reduce only';
          }
          else {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Order Placed';
          }


      }
      else if (!this.isLimit && this.isStopLoss && this.isMarket) {
        this.http.post(environment.Route + '/api/action/future-buy', {
          symbol: this.selectedCoin,
          quantity: this.buyAmount,
          leverage: this.currentLeverage,
          reduceOnly: this.isReduceOnly,

          quantityPrecision: this.coinDataList[this.selectedCoin].precision


        }).subscribe((res: any) => {

          this.authService.sendClickEvent();


          console.log(res)

          this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res: any) => {
            this.limitOpenOrders = [];
            console.log(res);
            if (res !== {}) {
              this.limitOpenOrders = res.data;
            }
          });
          this.http.get(environment.Route + '/api/action/future-account').subscribe((res: any) => {
            this.availableBalance = res.data.availableBalance;
          });
          this.http.get(environment.Route + '/api/action/future-positions').subscribe((res: any) => {

            this.positions = [];
            res.data.forEach(item => {
              if (item.entryPrice > 0) {
                this.positions.push(item);
                this.closePercentage.push(0.0);
              }
            });
            this.positions.reverse();

            console.log(this.positions);

            if (res !== {}) {
              this.openOrders = (res);
            }

          });
          if (res !== {}) {
            this.openOrders = (res);
          }

          if (res.data.code === -2010) {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Insufficient Fund';
          }
          else if (res.data.code === -2013) {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Error Placing Order';
          } else if (res.data.code === -4164) {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Order notional must be no smaller than 5.0 (unless you choose reduce only';
          }
          else if (res.data.code === -1013) {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Amount Lower Than Minimun Limit';
          }
          else {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Order Placed';
            this.http.post(environment.Route + '/api/action/future-stop-loss', {
              symbol: this.selectedCoin,
              quantity: this.buyAmount,
              stopPrice: this.stopPriceBuy,
              leverage: this.currentLeverage,
              reduceOnly: this.isReduceOnly,

              quantityPrecision: this.coinDataList[this.selectedCoin].precision,
              ratio: 100,
              side: 'SELL'

            }).subscribe((res: any) => {
              this.authService.sendClickEvent();

              this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res: any) => {
                this.limitOpenOrders = [];
                console.log(res);
                if (res !== {}) {
                  this.limitOpenOrders = res.data;
                }
              });
              this.http.get(environment.Route + '/api/action/future-account').subscribe((res: any) => {
                this.availableBalance = res.data.availableBalance;
              });
              this.http.get(environment.Route + '/api/action/future-positions').subscribe((res: any) => {

                this.positions = [];
                res.data.forEach(item => {
                  if (item.entryPrice > 0) {
                    this.positions.push(item);
                    this.closePercentage.push(0.0);
                  }
                });
                this.positions.reverse();

                console.log(this.positions);

                if (res !== {}) {
                  this.openOrders = (res);
                }

              });
              if (res.data.code === -2010) {
                this.isInsufficientFund = true;
                this.errMsgBuy = 'Insufficient Fund';
              }
              else if (res.data.code === -2013) {
                this.isInsufficientFund = true;
                this.errMsgBuy = 'Error Placing Order';
              }
              else if (res.data.code === -1013) {
                this.isInsufficientFund = true;
                this.errMsgBuy = 'Amount Lower Than Minimun Limit';
              }
              else {
                this.isInsufficientFund = true;
                this.errMsgBuy = 'Order Placed';
              }
            }, (err: HttpErrorResponse) => {

            });
          }
        }, (err: HttpErrorResponse) => {

        });

      } else {
        const dialogRef = this.dialog.open(InvalidMessage, {
          width: '550px'
        });
      }
    });

  }
  onInputChange(event: MatSliderChange) {
    this.currentLeverage = event.value;
    this.changeTotalPrice();
    this.changeTotalPriceSell();
  }
  sellPosition(symbol, sellAmount, sellAtPrice, leverage, amount) {
    console.log("amount", amount);
    const dialogRef = this.dialog.open(CloseOrderComponent, {
      width: '550px',
      data: { flag: 1, precision: this.coinDataList[symbol].precision, symbol: symbol, leverage: leverage, quatity: sellAmount, amount: amount }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.http.get(environment.Route + '/api/action/future-positions').subscribe((res: any) => {

        this.positions = [];
        res.data.forEach(item => {
          if (item.entryPrice > 0) {
            this.positions.push(item);
            this.closePercentage.push(0.0);
          }
        });
        this.positions.reverse();

        console.log(this.positions);

        if (res !== {}) {
          this.openOrders = (res);
        }

      });
      this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res: any) => {
        this.limitOpenOrders = [];
        console.log(res);
        if (res !== {}) {
          this.limitOpenOrders = res.data;
        }
      });
      this.http.get(environment.Route + '/api/action/future-account').subscribe((res: any) => {
        this.availableBalance = res.data.availableBalance;
      });
    });


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
      if (!this.isStopLossSell && this.isLImitSell && !this.isMarketSell) {
        this.http.post(environment.Route + '/api/action/future-limit', {
          symbol: this.selectedCoin,
          quantity: this.sellAmount,
          price: this.sellAtPriceLimit,
          leverage: this.currentLeverage,
          reduceOnly: this.isReduceOnly,

          quantityPrecision: this.coinDataList[this.selectedCoin].precision,
          side: 'SELL'


        }).subscribe((res: any) => {
          this.authService.sendClickEvent();
          this.http.get(environment.Route + '/api/action/future-account').subscribe((res: any) => {
            this.availableBalance = res.data.availableBalance;
          });
          this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res: any) => {
            this.limitOpenOrders = [];
            console.log(res);
            if (res !== {}) {
              this.limitOpenOrders = res.data;
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
            this.positions.reverse();

            console.log(this.positions);

            if (res !== {}) {
              this.openOrders = (res);
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
          else if (res.code === -4164) {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Order notional must be no smaller than 5.0 (unless you choose reduce only';
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
      } else if (this.isStopLossSell && !this.isLImitSell && this.isMarketSell) {
        this.http.post(environment.Route + '/api/action/future-sell', {
          symbol: this.selectedCoin,
          quantity: this.sellAmount,
          leverage: this.currentLeverage,
          quantityPrecision: this.coinDataList[this.selectedCoin].precision

        }).subscribe((res: any) => {
          this.http.post(environment.Route + '/api/action/future-stop-loss', {
            symbol: this.selectedCoin,
            quantity: this.sellAmount,
            price: this.sellAtPriceLimit,
            stopPrice: this.stopPriceSell,
            leverage: this.currentLeverage,
            reduceOnly: this.isReduceOnly,

            quantityPrecision: this.coinDataList[this.selectedCoin].precision,
            ratio: 100,
            side: 'BUY'


          }).subscribe((res: any) => {
            this.authService.sendClickEvent();

            this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res: any) => {
              this.limitOpenOrders = [];
              console.log(res);
              if (res !== {}) {
                this.limitOpenOrders = res.data;
              }
            });
            this.http.get(environment.Route + '/api/action/future-account').subscribe((res: any) => {
              this.availableBalance = res.data.availableBalance;
            });
            this.http.get(environment.Route + '/api/action/future-positions').subscribe((res: any) => {

              this.positions = [];
              res.data.forEach(item => {
                if (item.entryPrice > 0) {
                  this.positions.push(item);
                  this.closePercentage.push(0.0);
                }
              });
              this.positions.reverse();

              console.log(this.positions);

              if (res !== {}) {
                this.openOrders = (res);
              }

            });
          }, (err: HttpErrorResponse) => {

          });
          if (res.code === -2010) {
            this.isInsufficientFund2 = true;
            this.errMsg2 = 'Insufficient Fund';

          } else {
            this.isInsufficientFund2 = true;
            this.errMsg2 = 'Order Placed';
          }
        });
      } else if (!this.isStopLossSell && !this.isLImitSell && this.isMarketSell) {
        this.http.post(environment.Route + '/api/action/future-sell', {
          symbol: this.selectedCoin,
          quantity: this.sellAmount,
          leverage: this.currentLeverage,
          reduceOnly: this.isReduceOnly,

          quantityPrecision: this.coinDataList[this.selectedCoin].precision

        }).subscribe((res: any) => {
          this.authService.sendClickEvent();

          this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res: any) => {
            this.limitOpenOrders = [];
            console.log(res);
            if (res !== {}) {
              this.limitOpenOrders = res.data;
            }
          });
          this.http.get(environment.Route + '/api/action/future-account').subscribe((res: any) => {
            this.availableBalance = res.data.availableBalance;
          });
          this.http.get(environment.Route + '/api/action/future-positions').subscribe((res: any) => {

            this.positions = [];
            res.data.forEach(item => {
              if (item.entryPrice > 0) {
                this.positions.push(item);
                this.closePercentage.push(0.0);
              }
            });
            this.positions.reverse();

            console.log(this.positions);

            if (res !== {}) {
              this.openOrders = (res);
            }

          });

          if (res.code === -2010) {
            this.isInsufficientFund2 = true;
            this.errMsg2 = 'Insufficient Fund';

          } else if (res.code === -4164) {
            this.isInsufficientFund = true;
            this.errMsgBuy = 'Order notional must be no smaller than 5.0 (unless you choose reduce only';
          } else {
            this.isInsufficientFund2 = true;
            this.errMsg2 = 'Order Placed';
          }
        });
      } else if (this.isStopLossSell && !this.isLImitSell && !this.isMarketSell) {
        this.http.post(environment.Route + '/api/action/future-stop-loss', {
          symbol: this.selectedCoin,
          quantity: this.sellAmount,
          stopPrice: this.stopPriceSell,
          leverage: this.currentLeverage,
          reduceOnly: this.isReduceOnly,

          quantityPrecision: this.coinDataList[this.selectedCoin].precision,
          ratio: 100,
          side: 'SELL'


        }).subscribe((res: any) => {
          this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res: any) => {
            this.limitOpenOrders = [];
            console.log(res);
            if (res !== {}) {
              this.limitOpenOrders = res.data;
            }
          });
          this.http.get(environment.Route + '/api/action/future-account').subscribe((res: any) => {
            this.availableBalance = res.data.availableBalance;
          });
          this.http.get(environment.Route + '/api/action/future-positions').subscribe((res: any) => {

            this.positions = [];
            res.data.forEach(item => {
              if (item.entryPrice > 0) {
                this.positions.push(item);
                this.closePercentage.push(0.0);
              }
            });
            this.positions.reverse();

            console.log(this.positions);

            if (res !== {}) {
              this.openOrders = (res);
            }

          });
        }, (err: HttpErrorResponse) => {

        });
      } else {
        const dialogRef = this.dialog.open(InvalidMessage, {
          width: '550px'
        });
      }

    }, (err: HttpErrorResponse) => {
      console.log(err.message);
    });
  }
  getstockName(data): string {
    const name = data.split(':')[1];
    return name;
  }
  buy(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.isLimit && this.isMarket && !this.isStopLoss) {
      console.log(this.buyAmount);
      this.isInsufficientFund = false;
      const symbol = this.getstockName(this.wathcList[this.index]);
      console.log(symbol);
      this.http.post(environment.Route + '/api/action/buy', {
        symbol: this.selectedCoin,
        quantity: this.buyAmount
      }).subscribe((res: any) => {
        this.http.get<any>(environment.Route + '/api/user/user-balance').subscribe((res: any) => {
          console.log(res);
          this.limitAsset = [];
          if (res.asset === 'USDT') {
            this.availableBalance = Math.abs(Number(res.free));
          }
          res.forEach((data: any) => {
            this.limitAsset.push({
              name: data.asset,
              value: Math.abs(Number(data.free))
            });
            console.log(this.limitAsset);

          });
        });
        this.authService.sendClickEvent();

        if (res.code === -2010) {
          this.isInsufficientFund = true;
          this.errMsgBuy = 'Insufficient Fund';
        }
        else if (res.code === -2013) {
          this.isInsufficientFund = true;
          this.errMsgBuy = res.msg;
        }
        else if (res.code === -1013) {
          this.isInsufficientFund = true;
          this.errMsgBuy = res.msg;
        }
        else {
          this.isInsufficientFund = true;
          this.errMsgBuy = 'Order Placed';
          this.http.get(environment.Route + '/api/action/completed-orders').subscribe((res: any) => {
            console.log(res);
            console.log("Open orders", res);
            if (res !== {}) {
              this.completedOrders = [];
              this.completedOrders = res.reverse();

            }
          });
          this.http.get(environment.Route + '/api/action/openOrders').subscribe((res: any) => {
            console.log(res);
            if (res !== {}) {
              this.limitOpenOrders = [];
              this.limitOpenOrders = res.data;

            }
          });
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.message);
      });
    } else if (this.isLimit && !this.isMarket && !this.isStopLoss) {
      console.log(this.buyAmount);
      this.isInsufficientFund = false;
      const symbol = this.getstockName(this.wathcList[this.index]);
      console.log(symbol);
      this.http.get<any>(environment.Route + '/api/user/user-balance').subscribe((res: any) => {
        if (res.asset === 'USDT') {
          this.availableBalance = Math.abs(Number(res.free));
        }
        console.log(res);
        this.limitAsset = [];
        res.forEach((data: any) => {
          this.limitAsset.push({
            name: data.asset,
            value: Math.abs(Number(data.free))
          });
          console.log(this.limitAsset);

        });
      });
      this.http.post(environment.Route + '/api/action/buy-limit', {
        symbol: this.selectedCoin,
        quantity: this.buyAmount,
        price: this.buyAtPriceSpot,

      }).subscribe((res: any) => {
        this.authService.sendClickEvent();

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
          this.http.get(environment.Route + '/api/action/completed-orders').subscribe((res: any) => {
            console.log(res);
            console.log("Open orders", res);
            if (res !== {}) {
              this.completedOrders = [];
              this.completedOrders = res.reverse();

            }
          });
          this.http.get<any>(environment.Route + '/api/user/user-balance').subscribe((res: any) => {
            console.log(res);
            if (res.asset === 'USDT') {
              this.availableBalance = Math.abs(Number(res.free));
            }
            this.limitAsset = [];
            res.forEach((data: any) => {
              this.limitAsset.push({
                name: data.asset,
                value: Math.abs(Number(data.free))
              });
              console.log(this.limitAsset);

            });
          });
          this.http.get(environment.Route + '/api/action/openOrders').subscribe((res: any) => {
            console.log(res);
            if (res !== {}) {
              this.limitOpenOrders = [];
              this.limitOpenOrders = res.data;

            }
          });
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.message);
      });
    } else if (!this.isLimit && this.isMarket && this.isStopLoss) {
      console.log(this.buyAmount);
      this.isInsufficientFund = false;
      const symbol = this.getstockName(this.wathcList[this.index]);
      console.log(symbol);
      this.http.post(environment.Route + '/api/action/buy', {
        symbol: this.selectedCoin,
        quantity: this.buyAmount
      }).subscribe((res: any) => {

        if (res.code === -2010) {

        }
        else if (res.code === -2013) {

        }
        else if (res.code === -1013) {

        }
        else {
          this.http.post(environment.Route + '/api/action/stop-loss', {
            symbol: this.selectedCoin,
            quantity: this.buyAmount,
            stopPrice: this.stopPriceBuy,
            side: 'SELL'
          }).subscribe((res: any) => {
            this.authService.sendClickEvent();

            if (res.code === -2010) {
              this.isInsufficientFund = true;
              this.errMsgBuy = 'Insufficient Fund';
            }
            else if (res.code === -2013) {
              this.isInsufficientFund = true;
              this.errMsgBuy = res.msg;
            }
            else if (res.code === -1013) {
              this.isInsufficientFund = true;
              this.errMsgBuy = res.msg;
            } else {
              this.isInsufficientFund = true;
              this.errMsgBuy = 'Order Placed';
              this.http.get(environment.Route + '/api/action/completed-orders').subscribe((res: any) => {
                console.log(res);
                console.log("Open orders", res);
                if (res !== {}) {
                  this.completedOrders = [];
                  this.completedOrders = res.reverse();

                }
              });
              this.http.get<any>(environment.Route + '/api/user/user-balance').subscribe((res: any) => {
                console.log(res);
                this.limitAsset = [];
                if (res.asset === 'USDT') {
                  this.availableBalance = Math.abs(Number(res.free));
                }
                res.forEach((data: any) => {
                  this.limitAsset.push({
                    name: data.asset,
                    value: Math.abs(Number(data.free))
                  });
                  console.log(this.limitAsset);

                });
              });
              this.http.get(environment.Route + '/api/action/openOrders').subscribe((res: any) => {
                console.log(res);
                if (res !== {}) {
                  this.limitOpenOrders = [];
                  this.limitOpenOrders = res.data;

                }
              });
            }
          });
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.message);
      });
    } else if (!this.isLimit && !this.isMarket && this.isStopLoss) {
      this.http.post(environment.Route + '/api/action/stop-loss', {
        symbol: this.selectedCoin,
        quantity: this.buyAmount,
        stopPrice: this.stopPriceBuy,
        side: 'SELL'
      }).subscribe((res: any) => {
        this.authService.sendClickEvent();

        if (res.code === -2010) {
          this.isInsufficientFund = true;
          this.errMsgBuy = 'Insufficient Fund';
        }
        else if (res.code === -2013) {
          this.isInsufficientFund = true;
          this.errMsgBuy = res.msg;
        }
        else if (res.code === -1013) {
          this.isInsufficientFund = true;
          this.errMsgBuy = res.msg;
        } else {
          this.isInsufficientFund = true;
          this.errMsgBuy = 'Order Placed';
          this.http.get(environment.Route + '/api/action/completed-orders').subscribe((res: any) => {
            console.log(res);
            console.log("Open orders", res);
            if (res !== {}) {
              this.completedOrders = [];
              this.completedOrders = res.reverse();

            }
          });
          this.http.get<any>(environment.Route + '/api/user/user-balance').subscribe((res: any) => {
            console.log(res);
            this.limitAsset = [];
            if (res.asset === 'USDT') {
              this.availableBalance = Math.abs(Number(res.free));
            }
            res.forEach((data: any) => {
              this.limitAsset.push({
                name: data.asset,
                value: Math.abs(Number(data.free))
              });
              console.log(this.limitAsset);

            });
          });
          this.http.get(environment.Route + '/api/action/openOrders').subscribe((res: any) => {
            console.log(res);
            if (res !== {}) {
              this.limitOpenOrders = [];
              this.limitOpenOrders = res.data;

            }
          });
        }
      });
    } else {
      const dialogRef = this.dialog.open(InvalidMessage, {
        width: '550px'
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
  sell(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.isLImitSell && this.isMarketSell && !this.isStopLossSell) {

      console.log('sell');
      const symbol = this.getstockName(this.wathcList[this.index]);
      this.http.post(environment.Route + '/api/action/sell', {
        symbol: this.selectedCoin,
        quantity: this.sellAmount
      }).subscribe((res: any) => {
        this.authService.sendClickEvent();

        if (res.code === -2010) {
          this.isInsufficientFund2 = true;
          this.errMsg2 = 'Insufficient Fund';

        } else {
          this.isInsufficientFund2 = true;
          this.errMsg2 = 'Order Placed';
          this.http.get(environment.Route + '/api/action/completed-orders').subscribe((res: any) => {
            console.log(res);
            console.log("Open orders", res);
            if (res !== {}) {
              this.completedOrders = [];
              this.completedOrders = res.reverse();

            }
          });
          this.http.get<any>(environment.Route + '/api/user/user-balance').subscribe((res: any) => {
            console.log(res);
            this.limitAsset = [];
            if (res.asset === 'USDT') {
              this.availableBalance = Math.abs(Number(res.free));
            }
            res.forEach((data: any) => {
              this.limitAsset.push({
                name: data.asset,
                value: Math.abs(Number(data.free))
              });
              console.log(this.limitAsset);

            });
          });
          this.http.get(environment.Route + '/api/action/openOrders').subscribe((res: any) => {
            console.log(res);
            if (res !== {}) {
              this.limitOpenOrders = [];
              this.limitOpenOrders = res.data;

            }
          });
        }

      }, (err: HttpErrorResponse) => {
        console.log(err.message);
      });
    } else if (this.isLImitSell && !this.isMarketSell && !this.isStopLossSell) {
      this.authService.sendClickEvent();

      console.log('sell');
      const symbol = this.getstockName(this.wathcList[this.index]);
      this.http.post(environment.Route + '/api/action/sell-limit', {
        symbol: this.selectedCoin,
        quantity: this.sellAmount,
        price: this.sellAtPriceLimit
      }).subscribe((res: any) => {
        this.authService.sendClickEvent();

        if (res.code === -2010) {
          this.isInsufficientFund2 = true;
          this.errMsg2 = 'Insufficient Fund';

        } else {
          this.isInsufficientFund2 = true;
          this.errMsg2 = 'Order Placed';
          this.http.get(environment.Route + '/api/action/completed-orders').subscribe((res: any) => {
            console.log(res);
            console.log("Open orders", res);
            if (res !== {}) {
              this.completedOrders = [];
              this.completedOrders = res.reverse();

            }
          });
          this.http.get<any>(environment.Route + '/api/user/user-balance').subscribe((res: any) => {
            console.log(res);
            this.limitAsset = [];
            res.forEach((data: any) => {
              this.limitAsset.push({
                name: data.asset,
                value: Math.abs(Number(data.free))
              });
              console.log(this.limitAsset);

            });
          });
          this.http.get(environment.Route + '/api/action/openOrders').subscribe((res: any) => {
            console.log(res);
            if (res !== {}) {
              this.limitOpenOrders = [];
              this.limitOpenOrders = res.data;

            }
          });
        }

      }, (err: HttpErrorResponse) => {
        console.log(err.message);
      });
    } else if (!this.isLImitSell && this.isMarketSell && this.isStopLossSell) {
      this.authService.sendClickEvent();

      console.log('sell');
      const symbol = this.getstockName(this.wathcList[this.index]);
      this.http.post(environment.Route + '/api/action/sell', {
        symbol: this.selectedCoin,
        quantity: this.sellAmount
      }).subscribe((res: any) => {
        this.authService.sendClickEvent();

        if (res.code === -2010) {
          this.isInsufficientFund2 = true;
          this.errMsg2 = 'Insufficient Fund';

        } else {
          this.http.post(environment.Route + '/api/action/stop-loss', {
            symbol: this.selectedCoin,
            quantity: this.buyAmount,
            stopPrice: this.stopPriceBuy,
            side: 'BUY'
          }).subscribe((res: any) => {
            if (res.code === -2010) {
              this.isInsufficientFund2 = true;
              this.errMsg2 = 'Insufficient Fund';
            }
            else if (res.code === -2013) {
              this.isInsufficientFund2 = true;
              this.errMsg2 = res.msg;
            }
            else if (res.code === -1013) {
              this.isInsufficientFund2 = true;
              this.errMsg2 = res.msg;
            } else {
              this.isInsufficientFund2 = true;
              this.errMsg2 = 'Order Placed';
              this.http.get(environment.Route + '/api/action/completed-orders').subscribe((res: any) => {
                console.log(res);
                console.log("Open orders", res);
                if (res !== {}) {
                  this.completedOrders = [];
                  this.completedOrders = res.reverse();

                }
              });
              this.http.get(environment.Route + '/api/action/openOrders').subscribe((res: any) => {
                console.log(res);
                if (res !== {}) {
                  this.limitOpenOrders = [];

                  this.limitOpenOrders = res.data;

                }
              });
              this.http.get<any>(environment.Route + '/api/user/user-balance').subscribe((res: any) => {
                console.log(res);
                this.limitAsset = [];
                res.forEach((data: any) => {
                  this.limitAsset.push({
                    name: data.asset,
                    value: Math.abs(Number(data.free))
                  });
                  console.log(this.limitAsset);

                });
              });
            }
          });
        }

      }, (err: HttpErrorResponse) => {
        console.log(err.message);
      });
    } else if (!this.isLImitSell && !this.isMarketSell && this.isStopLossSell) {
      this.http.post(environment.Route + '/api/action/stop-loss', {
        symbol: this.selectedCoin,
        quantity: this.buyAmount,
        stopPrice: this.stopPriceBuy,
        side: 'BUY'
      }).subscribe((res: any) => {
        this.authService.sendClickEvent();

        if (res.code === -2010) {
          this.isInsufficientFund2 = true;
          this.errMsg2 = 'Insufficient Fund';
        }
        else if (res.code === -2013) {
          this.isInsufficientFund2 = true;
          this.errMsg2 = res.msg;
        }
        else if (res.code === -1013) {
          this.isInsufficientFund2 = true;
          this.errMsg2 = res.msg;
        } else {
          this.isInsufficientFund2 = true;
          this.errMsg2 = 'Order Placed';
          this.http.get(environment.Route + '/api/action/completed-orders').subscribe((res: any) => {
            console.log(res);
            console.log("Open orders", res);
            if (res !== {}) {
              this.completedOrders = [];

              this.completedOrders = res.reverse();

            }
          });
          this.http.get<any>(environment.Route + '/api/user/user-balance').subscribe((res: any) => {
            console.log(res);
            this.limitAsset = [];
            res.forEach((data: any) => {
              this.limitAsset.push({
                name: data.asset,
                value: Math.abs(Number(data.free))
              });
              console.log(this.limitAsset);

            });
          });
          this.http.get(environment.Route + '/api/action/openOrders').subscribe((res: any) => {
            console.log(res);
            if (res !== {}) {
              this.limitOpenOrders = [];

              this.limitOpenOrders = res.data;

            }
          });

        }
      });
    } else {
      const dialogRef = this.dialog.open(InvalidMessage, {
        width: '550px'
      });
    }

  }

  subscribewebsocket() {
    this.myWebSocket.subscribe((message: any) => {

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
        this.highPrice = message.h;
        this.lowPrice = message.l;
        this.volCoin = message.v;
        this.volUsdt = message.q;
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
        if (message.s === 'BTCUSDT' && this.coinDataList.BTCUSDT !== undefined) {
          this.coinDataList.BTCUSDT.priceChangePercent = message.P;
          this.coinDataList.BTCUSDT.priceChange = message.p;
          if (this.coinDataList.BTCUSDT.volume.length === 12) {
            if (!this.isFuture) {
              const history = {
                buyVolume: message.B,
                buPrice: message.b,
                sellVolume: message.A,
                sellPrice: message.a
              }
              this.coinDataList.BTCUSDT.volume.shift();
              this.coinDataList.BTCUSDT.volume.push(history);
            } else {
              const history = {
                buyVolume: message.Q,
                buPrice: message.c,

              }
              this.coinDataList.BTCUSDT.volume.shift();
              this.coinDataList.BTCUSDT.volume.push(history);
            }


          } else {
            if (!this.isFuture) {
              const history = {
                buyVolume: message.B,
                buPrice: message.b,
                sellVolume: message.A,
                sellPrice: message.a
              }
              this.coinDataList.BTCUSDT.volume.push(history);

            } else {
              const history = {
                buyVolume: message.Q,
                buPrice: message.c,

              }
              this.coinDataList.BTCUSDT.volume.push(history);

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
          this.coinDataList.BNBUSD.priceChange = message.p;

          if (this.coinDataList.BNBUSD.volume.length === 12) {
            if (!this.isFuture) {
              const history = {
                buyVolume: message.B,
                buPrice: message.b,
                sellVolume: message.A,
                sellPrice: message.a
              }
              this.coinDataList.BNBUSD.volume.shift();
              this.coinDataList.BNBUSD.volume.push(history);
            } else {
              const history = {
                buyVolume: message.Q,
                buPrice: message.c,

              }
              this.coinDataList.BNBUSD.volume.shift();
              this.coinDataList.BNBUSD.volume.push(history);
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
    }, error => {
      console.error(error); // handle errors
    }, () => console.log('complete'));

  }
  changeCoin(data) {
    this.myWebSocket.unsubscribe();
    this.tradingView(data);
    if (this.isFuture) {
      this.router.navigate(['/trade/future/' + data]);

    } else if (!this.isFuture) {
      this.router.navigate(['/trade/spot/' + data]);

    }
  }
  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value;
    console.log(value);
    return this.coinDataList.filter(coinDataList => coinDataList.indexOf(filterValue) === 0);
  }
  tradingView(data) {
    this.temp = new TradingView.widget(
      {


        symbol: 'BINANCE:' + data,
        interval: '5',
        timezone: 'Australia/Adelaide',
        theme: 'light',
        style: '1',
        locale: 'in',
        width: this.chartWidth - 100,
        height: 550,
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        hide_side_toolbar: false,

        container_id: 'tradingview_b0bf0'
      });
  }
  isolateMargin(symbol) {
    const dialogRef = this.dialog.open(IsolatedMargin, {
      width: '550px',
      data: { symbol: symbol, }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.http.get(environment.Route + '/api/action/future-positions').subscribe((res: any) => {

        this.positions = [];
        res.data.forEach(item => {
          if (item.entryPrice > 0) {
            this.positions.push(item);
            this.closePercentage.push(0.0);
          }
        });
        this.positions.reverse();

        console.log(this.positions);

        if (res !== {}) {
          this.openOrders = (res);
        }

      })
    });
  }
  closeOrder(symbol, ratio, quantityTotal) {
    // let qSell = Number(quantitySell);
    // let qTot = Number(quantityTotal);
    // qTot = Math.abs(qTot);
    // qSell = Math.abs(qSell);
    // const ratio = Math.round(qTot / qSell) * 100;
    const dialogRef = this.dialog.open(CloseOrderComponent, {
      width: '550px',
      data: { flag: 0, symbol: symbol, ratio: ratio, quatity: quantityTotal, precision: this.coinDataList[symbol].precision }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.authService.sendClickEvent();

      this.http.get(environment.Route + '/api/action/future-positions').subscribe((res: any) => {

        this.positions = [];
        res.data.forEach(item => {
          if (item.entryPrice > 0) {
            this.positions.push(item);
            this.closePercentage.push(0.0);
          }
        });
        this.positions.reverse();

        console.log(this.positions);

        if (res !== {}) {
          this.openOrders = (res);
        }

      });
      this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res: any) => {
        this.limitOpenOrders = [];
        console.log(res);
        if (res !== {}) {
          this.limitOpenOrders = res.data;
        }
      });
    });



  }
  closeALlOrder() {
    const dialogRef = this.dialog.open(CloseAllOrders, {
      width: '550px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.authService.sendClickEvent();

      this.http.get(environment.Route + '/api/action/future-positions').subscribe((res: any) => {

        this.positions = [];
        res.data.forEach(item => {
          if (item.entryPrice > 0) {
            this.positions.push(item);
            this.closePercentage.push(0.0);
          }
        });
        this.positions.reverse();

        console.log(this.positions);

        if (res !== {}) {
          this.openOrders = (res);
        }

      });
      this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res: any) => {
        this.limitOpenOrders = [];
        console.log(res);
        if (res !== {}) {
          this.limitOpenOrders = res.data;
        }
      });
    });

  }
  ngAfterViewInit(): void {
    this.tradingView(this.selectedCoin);
    setInterval(() => {
      this.http.get(environment.Route + '/api/action/future-open-orders').subscribe((res: any) => {
        this.limitOpenOrders = [];

        if (res !== {}) {
          this.limitOpenOrders = res.data;
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
    }, 5000)

    this.cdRef.detectChanges();
  }
}


@Component({
  selector: 'close-order',
  templateUrl: 'closeOrder.html',
})
export class CloseOrderComponent {
  item: any;
  ratio: any;
  sellAmount: any;
  sellAtPrice: any;
  constructor(
    public dialogRef: MatDialogRef<CloseOrderComponent>, @Inject(MAT_DIALOG_DATA) public data, public http: HttpClient, public authService: AuthService, public router: Router, public dialog: MatDialog) {
    this.item = data;
  }

  limitOrder() {
    let Side = '';
    console.log(this.item);
    let div = this.ratio / 100;
    if (this.item.amount.substring(0, 1) === '-') {
      Side = 'BUY'
    } else {
      Side = 'SELL'

    }

    this.http.post(environment.Route + '/api/action/future-limit', {
      symbol: this.item.symbol,
      quantity: this.sellAmount,
      price: this.sellAtPrice,
      leverage: this.item.leverage,
      quantityPrecision: this.item.precision,
      side: Side,
      reduceOnly: true



    }).subscribe((res: any) => {
      console.log(res);
      this.authService.sendClickEvent();
      this.dialogRef.close();


    });

  }
  closePos() {
    console.log('Called');
    let Side = '';
    console.log(this.item);
    let div = this.ratio / 100;
    if (this.item.quatity.substring(0, 1) === '-') {
      Side = 'BUY'
    } else {
      Side = 'SELL'

    }
    let amountDec = this.item.quatity * div;

    let quantity = Number(amountDec.toFixed(this.item.precision));
    console.log(quantity);
    this.http.post(environment.Route + '/api/action/future-close-position', {
      symbol: this.item.symbol,
      quantity: Math.abs(quantity),
      side: Side,
      ratio: this.ratio,
      quantityPrecision: this.item.precision,
      reduceOnly: true

    }).subscribe((res) => {
      console.log(res);
      this.authService.sendClickEvent();
      this.dialogRef.close();

    });

  }
}
@Component({
  selector: 'close-all',
  templateUrl: 'closeAll.html',
})
export class CloseAllOrders {
  constructor(public http: HttpClient, public dialogRef: MatDialogRef<CloseAllOrders>) {

  }
  closeAll() {
    this.http.post(environment.Route + '/api/action/future-cancle-all-orders', {}).subscribe((res) => {
      console.log(res);
      this.dialogRef.close();

    });
  }
  closeDialog() {
    this.dialogRef.close();

  }
}
@Component({
  selector: 'invalid-message',
  templateUrl: 'invalidCombo.html',
})
export class InvalidMessage {
  constructor(public dialogRef: MatDialogRef<InvalidMessage>) {

  }
  onclose() {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'isolated-margin',
  templateUrl: 'isolatedMargin.html',
})
export class IsolatedMargin {
  item: any;
  marginPrice = 0;
  marginBalace = 0;
  balance = 0
  amount = 0;
  constructor(
    public dialogRef: MatDialogRef<IsolatedMargin>, @Inject(MAT_DIALOG_DATA) public data, public http: HttpClient, public authService: AuthService, public router: Router, public dialog: MatDialog) {
    this.item = data;
    this.http.get(environment.Route + '/api/action/future-account').subscribe((res: any) => {
      console.log(res);
      this.balance = res.data.availableBalance;
      this.marginBalace = res.data.totalMarginBalance;
      res.data.positions.forEach(res => {


        if (res.symbol === this.item.symbol) {
          this.marginPrice = res.maintMargin;
          console.log(res);
        }
      });


    });
  }
  marginData(i) {
    this.http.post(environment.Route + '/api/action/future-position-margin', {
      "symbol": this.item.symbol,
      "amount": this.amount,
      "type": i
    }).subscribe((res) => {
      this.authService.sendClickEvent();
      this.dialogRef.close();
    });
  }
}
