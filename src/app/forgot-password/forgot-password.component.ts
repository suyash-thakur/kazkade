import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  newPassword;
  confPassword;
  token;
  userid;
  error;
  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.userid = this.route.snapshot.queryParams.id;
    this.token = this.route.snapshot.queryParams.token;
    console.log(this.userid);
  }

  ngOnInit(): void {
  }
  resetPassword(): void {
    if (this.newPassword === this.confPassword) {
      this.http.post(environment.Route + '/api/user/reset-password', {
        token: this.token,
        userId: this.userid,
        password: this.newPassword

      }).subscribe(res => {
        console.log(res);
      });
    } else {
      this.error = `Password doesn't Match`
    }

  }
}
