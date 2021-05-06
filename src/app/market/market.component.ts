import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../shared/auth.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { BuycomComponent } from '../buycom/buycom.component';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {
  // tslint:disable-next-line: variable-name
  call_market=true;
  arr: any;
  news_photos: any
  ran_no: any;
  call = true;
  news = [];
  endpoint = environment.Route+'/api/data/news';
  // tslint:disable-next-line: ban-types
  currentUser: Object = {};
  constructor(public dialog: MatDialog, private httpService: HttpClient, private http: HttpClient, public authService: AuthService,
    private actRoute: ActivatedRoute) {
    this.http.get('https://newsapi.org/v2/everything?q=bitcoin&apiKey=2edf6f125baf49c9a1e4224351124306').subscribe((res: any) => {
      console.log(res);
      this.news = res.articles;
      this.call = true;
    });
     }
  ngOnInit(): void {
    this.news_photos = ["../../assets/news1.jpeg","../../assets/news2.jpeg","../../assets/news3.jpeg","../../assets/news4.jpeg"]
    // this.httpService.get(this.endpoint).subscribe(
    //   data => {
    //     let i=0;
    //     // tslint:disable-next-line: no-string-literal
    //     this.arr = data;	 // FILL THE ARRAY WITH DATA
    //     console.log(this.arr);
    //     this.call = false;
    //     //console.log(this.arr.results[0].title);
    //   },
    //   (err: HttpErrorResponse) => {
    //     console.log (err.message);
    //   }
    // );


  }
 
  getData(pred,s) {
    // tslint:disable-next-line: radix
    s=parseInt(s);
    // tslint:disable-next-line: radix
    const cost=parseFloat((pred.cur_price).toFixed(2));
    this.http.post(environment.Route+'/stocks',
    {
      quant: s,
      description: pred.stk_name,
      initcost: cost
    })
    .subscribe(data => {});
  }
  callfunc()
  {
    this.ran_no = Math.floor((Math.random() * 4) + 0);
  }
  openDialog(pred,s): void {
    // tslint:disable-next-line: no-use-before-declare
    this.getData(pred,s);
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(BuycomComponent, {
      width: '250px',
    });
  }
  check(a,b): boolean{
    a=parseFloat(a);
    b=parseFloat(b);
    if(a>b)
    {
      return false;
    }
    return true;
  }
  convert(a,b)
  {
    // a=parseFloat(a);
    // b=parseFloat(b);
    const c=parseFloat(((a*b).toFixed(2)));
    return c;
  }
  trackById(item) {
    return item.id
  }
  openTab(index) {
    window.location.href = this.news[index].url;
  }
}
