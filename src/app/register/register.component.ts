import { Component, OnInit } from '@angular/core';
// import 'rxjs/rx';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  url = 'wss://fstream.binance.com/ws/btcusdt@kline_1m'
  ws = new WebSocket(this.url);
  a=0;
  market:any;

  constructor() {
  }
  createObservableSocket(url:string){
    // this.ws.onmessage = function(event, )
    this.ws = new WebSocket(url);
    return new Observable(observer => {
        this.ws.onmessage = (e) => {
            // console.log(e.data);
            try {
                var object = JSON.parse(e.data);
                observer.next(object);
            } catch (e) {
                 console.log("Cannot parse data : " + e);
            }
        }
        // this.ws.onerror = (event) => observer.error(event);
        // this.ws.onclose = (event) => observer.complete();
    }
    );
}
  public generateDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([baseval, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }
  addDatatoChart(){}
  ngOnInit() {

    // this.ws.onmessage = function (event){
    //   console.log(event.data);
    // }
    
    // this.createObservableSocket(this.url).subscribe((res:any) => {
    //   console.log(res.k);
    //   this.market = res.k;
    //   });
  }
}