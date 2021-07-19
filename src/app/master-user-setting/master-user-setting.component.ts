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
  isUpdatePass = false;
  opened = false;
  src = '../../assets/image 42.png';
  isError = false;
  files: any;
  subject = '';
  description = '';
  support = '';
  userName = '';
  email = '';
  mobile = '';
  confPassword = '';
  userType = '';
  isDis = [true, true, true, true];
  apiKey = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  password = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  securityKey = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  isSupportSend = false;

  constructor(public http: HttpClient, public router: Router, public authService: AuthService) {
    if (window.innerWidth > 720) {
      this.opened = true;
    }
  }

  ngOnInit(): void {
    this.userName = localStorage.getItem('user_name');
    this.email = localStorage.getItem('email');
    this.mobile = localStorage.getItem('mobile');
    this.userType = localStorage.getItem('userType');
    let temp = localStorage.getItem('imgUrl');
    this.description = localStorage.getItem('description');

    console.log(temp);

    if (temp !== null && temp !== 'undefined') {
      this.src = localStorage.getItem('imgUrl');

    }
  }
  connectToTwitter() {
    this.authService.login();
  }
  disconnectTwiiter() {
    this.authService.disconnectTwitter();
  }
  submitDescription() {
    this.http.post(environment.Route + '/api/master-trader/mt-description', {
      description: this.description
    }).subscribe((res) => {
      console.log(res);
      this.isUpdateDesc = true;

    });
  }
  passwordEdit() {
    this.http.put(environment.Route + '/api/user/update-user', {
      full_name: this.userName,
      mno: this.mobile,
      email: this.email,
      password: this.password
    }).subscribe((res: any) => {
      console.log(res);
      localStorage.setItem('user_name', res.full_name);
      localStorage.setItem('email', res.email);
      localStorage.setItem('mobile', res.mno);
      this.userName = res.full_name;
      this.email = res.email;
      this.mobile = res.mno;
      this.isUpdatePass = true;


    });
  }
  onSelectFile(event: FileList) {

    let filesToUpload = event.item(0);
    console.log(filesToUpload);
    const formData = new FormData();
    formData.append('image', filesToUpload, filesToUpload.name);
    let headers = new Headers();

    this.http.post(environment.Route + '/api/user/image-upload', formData).subscribe((x: any) => {
      console.log(x);
      if (x.url !== undefined) {
        localStorage.setItem('imgUrl', x.url);
        this.src = x.url;

      }
    });
  }
  submitDetails() {
    this.http.put(environment.Route + '/api/user/update-user', {
      full_name: this.userName,
      mno: this.mobile,
      email: this.email,
    }).subscribe((res: any) => {
      console.log(res);
      if (res.name === 'MongoError') {
        this.isError = true;
        return;
      }
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
      if (res.msg === "Invalid API keys") {
        this.authService.isInvalidAPI = true;
        localStorage.setItem('isInvalidAPI', 'true');
      } else {
        this.authService.isInvalidAPI = false;
        localStorage.setItem('isInvalidAPI', 'false');

      }
      this.isUpdateAPI = true;

    });
  }
  submitSupport() {
    this.http.post(environment.Route + '/api/user/support-mail', {
      msg: this.support
    }).subscribe((res: any) => {
      this.isSupportSend = true;
    });

  }
  passChange() {
    this.router.navigate(['/enterForgotPassword']);
  }
  toggleEdit(i) {
    this.isDis[i] = !this.isDis[i];
    if (i === 1) {
      this.apiKey = '';
      this.securityKey = '';
    }

  }
}
