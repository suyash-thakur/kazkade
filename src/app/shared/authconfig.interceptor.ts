import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }
  excludeList = ['https://api.binance.com/api/v3/exchangeInfo'];
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!req.url.includes('https://api.binance.com/api/') && !req.url.includes('https://cryptopanic.com/api/v1/posts/?auth_token=5bd0dc01b08d79cf872769b54124755e9d724bba') && !req.url.includes('https://api.twitter.com/')) {
      const authToken = this.authService.getToken();
      console.log(req.url);
      req = req.clone({
          setHeaders: {
              Authorization: 'Bearer ' + authToken
          }
      });
    } else if (req.url.includes('https://api.twitter.com/')) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + environment.Twitter_Bearer_Token
        }
      });
      }

        return next.handle(req);
    }
}
