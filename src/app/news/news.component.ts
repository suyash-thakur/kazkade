import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  call = false;
  news = [];
  constructor( private http: HttpClient) {
    this.http.get('https://newsapi.org/v2/everything?q=crypto&apiKey=2edf6f125baf49c9a1e4224351124306&sortBy=publishedAt').subscribe((res: any) => {
      console.log(res);

      this.news = res.articles;
      this.call = true;
    }, (err) => {
      this.http.get('https://api.npoint.io/786ef10a189b8277987c').subscribe((res: any) => {
        console.log(res);
        this.news = res.articles;
        this.call = true;
      });

    });
   }

  ngOnInit(): void {
  }
  openTab(index) {
    window.location.href = this.news[index].url;
  }
  sortFunc(a, b) {
    return a.publishedAt - b.publishedAt
  }
}
