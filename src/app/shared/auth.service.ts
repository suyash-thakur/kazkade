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
  currentUser = {};
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
    })
      .pipe(
        catchError(this.handleError)
      )
  }

  // Sign-in
  signIn(user: User): boolean {
    var url_to_hit = this.endpoint+'/login'
    console.log(user);
    // tslint:disable-next-line: prefer-const
    this.http.post<any>(url_to_hit, user)
      .subscribe((res: any) => {
        if(res.access_token==null){
          this.t=false;
        }
        else{
          localStorage.setItem('access_token', res.access_token)
          localStorage.setItem('binance_user',String(res.is_binance_user))
          this.router.navigate(['/dashboard']);
          LoggedInUser.full_name = res.user.full_name;
      }
      },
      (err: HttpErrorResponse) => {
        this.t=false;
        console.log (err.message);
      }
      );
      if(this.t)
      {
        return true;
      }
      return false;

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