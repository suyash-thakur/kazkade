import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-forgot-password-input',
  templateUrl: './forgot-password-input.component.html',
  styleUrls: ['./forgot-password-input.component.css']
})
export class ForgotPasswordInputComponent implements OnInit {
  emailPassword = '';
  showMsg = false;

  constructor(public authService: AuthService,
    public router: Router) { }

  ngOnInit(): void {
  }
  sendmail() {
    this.authService.sendEmail(this.emailPassword).subscribe((res) => {
      this.showMsg = true;
    });
  }

}
