import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../shared/auth.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { BuycomComponent } from '../buycom/buycom.component';

@Component({
  selector: 'app-predict',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.css']
})
// tslint:disable-next-line: component-class-suffix
export class PredictComponent implements OnInit {
  // arr: string [];
  market = 'trending_up';
  arr = [
    {
      curr: "BTC",
      units: "0.000123",
      avgop: "$56000",
      invested: "$12000",
      pnl: "2000",
      pnlp: "20%"
    },
    {
      curr: "BTC",
      units: "0.000123",
      avgop: "$56000",
      invested: "$12000",
      pnl: "2000",
      pnlp: "20%"
    },
    {
      curr: "BTC",
      units: "0.000123",
      avgop: "$56000",
      invested: "$12000",
      pnl: "2000",
      pnlp: "20%"
    },
    {
      curr: "BTC",
      units: "0.000123",
      avgop: "$56000",
      invested: "$12000",
      pnl: "2000",
      pnlp: "20%"
    },
    {
      curr: "BTC",
      units: "0.000123",
      avgop: "$56000",
      invested: "$12000",
      pnl: "2000",
      pnlp: "20%"
    },
    {
      curr: "BTC",
      units: "0.000123",
      avgop: "$56000",
      invested: "$12000",
      pnl: "2000",
      pnlp: "20%"
    }
  ]
  call = true;
  orderData = [];
  // tslint:disable-next-line: ban-types
  currentUser: Object = {};
  constructor(public dialog: MatDialog, private httpService: HttpClient, private http: HttpClient, public authService: AuthService,
    private actRoute: ActivatedRoute) {
     }
  ngOnInit(): void {
    this.http.get(environment.Route + '/api/action/future-all-orders').subscribe((res: any) => {
      this.orderData = res.data;
      console.log(this.orderData);
    });
  }

  openDialog(pred,s): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(BuycomComponent, {
      width: '250px',
    });
  }
  spotOrders() {
    this.http.get(environment.Route + '/api/action/openOrders').subscribe((res: any) => {
      console.log(res);
      this.orderData = res.data;

    });
  }
  futureOrders() {
    this.http.get(environment.Route + '/api/action/future-all-orders').subscribe((res: any) => {
      console.log(res);
      this.orderData = res.data;

    });
  }
  check(a,b): boolean{
    a=parseFloat(a);
    b=parseFloat(b)
    if(a>b)
    {
      return false;
    }
    return true;
  }
  convert(a,b)
  {
    const c=parseFloat(((a*b).toFixed(2)));
    return c;
  }
  trackById(item) {
    return item.id
}
}
