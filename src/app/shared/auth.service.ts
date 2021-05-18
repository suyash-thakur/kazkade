import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router, UrlSegment } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoggedInUser } from '../shared/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  t=true;
  endpoint = environment.Route+'/api/user';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  id;
  isFuture = false;
  followers = [];
  currentUser = {};
  selectedPlan = '';
  showMenu = true;
  subscription = null;
  isWrongCred = false;

  email = '';
  userId = '';
  userType = '';
  constructor(
    private http: HttpClient,
    public router: Router
  ) {
  }

  // Sign-up
  signUp(user: User): Observable<any> {
    const api = `${this.endpoint}/register`;
    user.sso_enabled = "true";
    user.newsletter = "true";
    return this.http.post(api, {
      full_name: user.full_name,
      mno: user.mno,
      email: user.email,
      sso_enabled: user.sso_enabled,
      newsletter: user.newsletter,
      password: user.password
    });
  }
  sendEmail(email) {
    return this.http.post(environment.Route + '/api/user/forget-password', {
      email: email
    });
  }
  tokenRefresh() {
    this.http.get(environment.Route + '/api/user/relogin').subscribe((res: any) => {
      console.log(res);
      localStorage.setItem('access_token', res.access_token);
      this.subscription = res.subscription;
      this.userType = res.user.userType;
      localStorage.setItem('userSubscription', JSON.stringify(this.subscription));
      localStorage.setItem('userType', this.userType);
    });
  }
  // Sign-in
  signIn(user: User) {
    var url_to_hit = this.endpoint+'/login'
    console.log(user);
    // tslint:disable-next-line: prefer-const
    this.http.post<any>(url_to_hit, user)
      .subscribe((res: any) => {
        console.log(res);
        if(res.access_token==null){
          this.t=false;
        }
        else{
          localStorage.setItem('access_token', res.access_token);
          console.log(res.access_token);
          if (res.user !== undefined) {
            this.userType = res.user.userType;
            this.subscription = res.subscription;
            localStorage.setItem('userSubscription', JSON.stringify(this.subscription));
            localStorage.setItem('userType', this.userType);
            localStorage.setItem('email', res.user.email);
            localStorage.setItem('mobile', res.user.mno);
            this.userId = res.user._id;
            localStorage.setItem('userId', res.user._id);

            this.email = res.user.email;

            localStorage.setItem('binance_user', String(res.is_binance_user));
            localStorage.setItem('user_name', res.user.full_name);
            localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/dashboard']);
            this.id = res.user._id;
          LoggedInUser.full_name = res.user.full_name;
          }
          if (res.user_type !== undefined) {
            this.userType = res.user_type;
          }

          if (this.userType === 'admin') {
            this.showMenu = false;
            localStorage.setItem('isLoggedIn', 'true');
            this.router.navigate(['/admin']);
          }
          if (this.userType)
            this.http.get(environment.Route + '/api/master-trader/followed').subscribe((res: any) => {
              console.log(res);
              this.followers = res;
            });
        }
        if (this.t === true) {
          return true;
        }
        return false;
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
        if (err.status === 400) {
          this.t = false;
          this.isWrongCred = true;
          console.log('400 error', this.isWrongCred);

          return this.t;
        }
      }
      );


  }

  get binanceuser(): boolean{
    const usr = localStorage.getItem('binance_user');
    return (usr!=='false') ? true : false;
  }


  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  doLogout() {
    const removeToken = localStorage.removeItem('access_token');
    localStorage.setItem('isLoggedIn', 'false');

    if (removeToken == null) {
      this.router.navigate(['']);
    }
  }
  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
