import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.css']
})
export class ProfitLossComponent implements OnInit {

  constructor(public router: Router,
    private http: HttpClient, public authService: AuthService) { }
  pnlData: any;
  coinData = [];
    isLoaded = false;
  ngOnInit(): void {

    this.http.get<any>(environment.Route + '/api/action/future-account').subscribe((res: any) => {
      this.pnlData = res;
      this.pnlData.data.positions.forEach((item) => {
        if (Number(item.positionAmt) > 0) {
          this.coinData.push(item);
        }
      });
      this.isLoaded = true;
      // console.log(res);
    },
    (err: HttpErrorResponse) => {
      console.log (err.message);
    }
    );
  }
  profitPercent(total, profit) {
    let perccentage = (profit / total) * 100;
    return perccentage;
  }
}
