import { Component, Inject, AfterViewInit, HostListener } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationStart, NavigationCancel, NavigationEnd }
from '@angular/router';
import {Title} from "@angular/platform-browser";
import {LoggedInUser} from "../app/shared/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  title = 'Kazkade';
  indeterminate='indeterminate';
  name:string;
  loading;
  constructor(private titleService:Title, private httpService: HttpClient, private http: HttpClient, public authService: AuthService, private router: Router) {
    this.loading = true;
    this.titleService.setTitle("Kazkade");
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
    this.logout();
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
  
}
