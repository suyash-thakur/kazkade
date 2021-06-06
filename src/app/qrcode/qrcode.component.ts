import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/auth.service';
@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent implements OnInit {
  url: any;
  key: any;
  constructor(public http: HttpClient, public router: Router, public authService: AuthService) { }

  ngOnInit(): void {
    this.http.get(environment.Route + '/api/user/get-2fa-qr-code').subscribe((res: any) => {
      console.log(res);
      this.url = res.url;
      this.key = res.key.split('=')[1];
    });
  }
  showVerify() {
    this.router.navigate(['/verify']);
  }
}
