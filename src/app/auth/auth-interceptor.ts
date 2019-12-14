import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (req.url === `${environment.serverUri}/api/authenticate` || req.url === `${environment.serverUri}/api/teams`
            || req.url === `${environment.serverUri}/api/users`) 
            return next.handle(req);
            
        const token = JSON.parse(localStorage.getItem('user_data')).access_token;

        if (token) {
            const modifiedRequest = req.clone({ headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) })
            return next.handle(modifiedRequest);
        }
        return next.handle(req);
    }
}