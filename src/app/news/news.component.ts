import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  call = false;
  news = [];

  constructor(private http: HttpClient) {
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'X-Master-Key': '$2b$10$1DwxAPXj6bJs.rftp7VHa.h184vJQfenVftqjZS9U/dBequyuzMQq'
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    this.http.get('https://api.jsonbin.io/b/60f46d34c1256a01cb724ac7', requestOptions).subscribe((res: any) => {
      console.log(res);

      this.news = res.articles;
      this.call = true;
    }, (err) => {
      // this.http.get('https://api.jsonbin.io/b/60f46d34c1256a01cb724ac7').subscribe((res: any) => {
      //   console.log(res);
      //   this.news = res.articles;
      //   this.call = true;
      // });

    });
   }

  ngOnInit(): void {
  }
  openTab(index) {
    window.open(this.news[index].url, 'blank')
  }
  sortFunc(a, b) {
    return a.publishedAt - b.publishedAt
  }
}
