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
  isUpdate = false;
  isUpdateAPI = false;
  isUpdateDesc = false;
  opened = false;
  description = '';
  userName = '';
  email = '';
  mobile = '';
  confPassword = '';
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
      this.isUpdateDesc = true;
    });
  }

  submitDetails() {
    this.http.put(environment.Route + '/api/user/update-user', {
      full_name: this.userName,
      mno: this.mobile,
      email: this.email,
      password: this.confPassword
    }).subscribe((res: any) => {
      console.log(res);
      localStorage.setItem('user_name', res.full_name);
      localStorage.setItem('email', res.email);
      localStorage.setItem('mobile', res.mno);
      this.userName = res.full_name;
      this.email = res.email;
      this.mobile = res.mno;
      this.isUpdate = true;


    });
  }
  submitAPIKey() {
    this.http.put(environment.Route + '/api/user/update-user-key', {
      path_secret_key: this.securityKey,
      path_api_key: this.apiKey
    }).subscribe((res: any) => {
      console.log(res);
      this.isUpdateAPI = true;
    });
  }


  toggleEdit() {
    this.isDis = !this.isDis;
    this.apiKey = '';
    this.password = '';
    this.securityKey = '';
  }
}
