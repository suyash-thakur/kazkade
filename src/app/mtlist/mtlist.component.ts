import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './../shared/auth.service';

@Component({
  selector: 'app-mtlist',
  templateUrl: './mtlist.component.html',
  styleUrls: ['./mtlist.component.css']
})
export class MtlistComponent implements OnInit {

  panelOpenState = false;
  endpoint = environment.Route+'/api/master-trader';
  
  arr: any;

  constructor(private httpService: HttpClient,public router: Router,
    private http: HttpClient, public authService: AuthService,
    private actRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.http.get<any>(this.endpoint).subscribe((res: any) => {
      this.arr = res;
      console.log(this.arr[0].user[0]);
    },
    (err: HttpErrorResponse) => {
      console.log (err.message);
    }
    );
  }
}
