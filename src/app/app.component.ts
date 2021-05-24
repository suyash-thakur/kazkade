import { Component, Inject, AfterViewInit, HostListener } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationStart, NavigationCancel, NavigationEnd }
from '@angular/router';
import {Title} from "@angular/platform-browser";
import {LoggedInUser} from "../app/shared/user";
import { environment } from 'src/environments/environment';
import { RecaptchaComponent } from 'ng-recaptcha';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  title = 'Kazkade';
  indeterminate = 'indeterminate';
  notification = [];
  timestamp = [];
  name:string;
  loading;
  constructor(private titleService: Title, private httpService: HttpClient, private http: HttpClient, public authService: AuthService, public router: Router) {
    this.loading = true;
    this.titleService.setTitle("Kazkade");
    let isLoggedIn = localStorage.getItem('isLoggedIn');
    this.authService.userType = localStorage.getItem('userType');
    if (this.authService.userType === 'admin') {
      this.authService.showMenu = false;

    }
    RecaptchaComponent.prototype.ngOnDestroy = function () {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }

    console.log(this.authService.userType);
    if (isLoggedIn === 'true') {
      let userName = localStorage.getItem('user_name');
      this.authService.userType = localStorage.getItem('userType');
      if (this.authService.userType === 'admin') {
        this.authService.showMenu = false;
      }


      this.authService.subscription = localStorage.getItem('userSubscription');
      console.log(this.authService.subscription);

      console.log(this.authService.userType);
      LoggedInUser.full_name = userName;
      this.username();
      this.http.get(environment.Route + '/api/master-trader/followed').subscribe((res: any) => {
        console.log(res);
        this.authService.followers = res;
      });
      this.http.get(environment.Route + '/api/user/notification').subscribe((res: any) => {
        console.log(res);
        res.forEach((item) => {
          if (this.convertJson(item.notification)) {
            console.log(JSON.parse(item.notification));
            this.notification.push(JSON.parse(item.notification));
            this.timestamp.push(item.updatedAt);
          }


        })
      });
    }

  }
  convertJson(str): boolean {
    try {
      JSON.parse(str);
    } catch (e) {
      return false
    }
    return true
  }
  arr: string [];
  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit() {
        this.router.events
            .subscribe((event) => {
                if(event instanceof NavigationStart) {
                    this.loading = true;
                }
                else if (
                    event instanceof NavigationEnd ||
                    event instanceof NavigationCancel
                    ) {
                    this.loading = false;
                }
            });
    }
    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event) {
      let userName = localStorage.getItem('user_name');
      LoggedInUser.full_name = userName;
      this.username();

    }
  logout() {
    LoggedInUser.full_name = "";
    this.authService.doLogout()
  }
  username(){
    this.name = LoggedInUser.full_name;
    //console.log("Hi ",this.name);
    return true;
  }
  futureSelect() {
    this.authService.isFuture = true;
    this.router.navigate(["/trade/future/ETHUSDT"]);
  }
  spotSelect() {
    this.authService.isFuture = false;
    this.router.navigate(["/trade/spot/BTCUSDT"]);

  }

}
