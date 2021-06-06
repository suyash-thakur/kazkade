import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-qrcode-verify',
  templateUrl: './qrcode-verify.component.html',
  styleUrls: ['./qrcode-verify.component.css']
})
export class QrcodeVerifyComponent implements OnInit {
  verificationCode = '';
  isErr = false;
  erMsg = '';
  constructor(public http: HttpClient, public router: Router, public authService: AuthService) { }

  ngOnInit(): void {
  }
  verifyQR() {
    this.http.post(environment.Route + '/api/user/verify-2fa-code', {
      "token": this.verificationCode
    }).subscribe((res: any) => {
      console.log(res);
      if (!res.verified) {
        console.log("called", res.verified);
        this.isErr = true;
        this.authService.is_2fa_completed = false;

        localStorage.setItem('is_2fa_completed', 'false');
        this.erMsg = 'Invalid verification code.';
      } else {
        this.authService.is_2fa_completed = true;

        localStorage.setItem('is_2fa_completed', 'false');
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
