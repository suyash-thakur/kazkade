import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-master-user-setting',
  templateUrl: './master-user-setting.component.html',
  styleUrls: ['./master-user-setting.component.css']
})
export class MasterUserSettingComponent implements OnInit {
  showFiller = false;
  opened = false;
  description = '';
  userName = '';
  email = '';
  mobile = '';
  isDis = true;
  apiKey = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  password = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  securityKey = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

  constructor(public http: HttpClient, public router: Router, public authService: AuthService) {
    if (window.innerWidth > 720) {
      this.opened = true;
    }
  }

  ngOnInit(): void {
    this.userName = localStorage.getItem('user_name');
    this.email = localStorage.getItem('email');
    this.mobile = localStorage.getItem('mobile');
  }
  submitDescription() {
    this.http.post(environment.Route + '/api/master-trader/mt-description', {
      decription: this.description
    }).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/userProfile']);
    });
  }
  toggleEdit() {
    this.isDis = !this.isDis;
    this.apiKey = '';
    this.password = '';
  }
}
