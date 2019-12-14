import { Injectable, ComponentFactoryResolver, ɵConsole } from '@angular/core';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../components/user.model';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    serverUrl = environment.serverUri;
    authenticated = false;
    private tokenStr: string;
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router, private _snackBar: MatSnackBar) {}

    authenticateLogin(loginForm: any): Promise<boolean> {
        const params = new HttpParams()
            .set('username', loginForm.username)
            .set('password', loginForm.password)

        const headers = new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        
        return (
            this.http.post(`${this.serverUrl}/api/authenticate`, params.toString(), { headers })
                .toPromise()
                    .then((result: User) => {
                        const user = {
                            username: result.username,
                            team_id: result.team_id,
                            profile_pic_url: result.profile_pic_url,
                            access_token: result.access_token,
                            token_type: result.token_type
                        }

                        localStorage.setItem('user_data', JSON.stringify(user));
                        //to time out user
                        this.tokenExpirationTimer = jwt_decode(user.access_token).exp;;
                        this.tokenStr = user.access_token;

                        return Promise.resolve(true);
                     })
                    .catch(() => {
                        return Promise.reject(false);
        })
    )}

    autoLogout() {
        setTimeout(() => {
                this.deleteExpiredToken();

                this._snackBar.open('Session timed out. Please log in again. Thanks.', 'OK', {
                    duration: 10000,
                });
            }, (this.tokenExpirationTimer - new Date().getTime()/1000)*1000);
    }

    logout() {
        this.deleteExpiredToken();
    }

    deleteExpiredToken() {
        return this.http.delete(`${this.serverUrl}/api/jwt/${this.tokenStr}`).toPromise()
            .then(result => {
                localStorage.removeItem('user_data');
                localStorage.removeItem('updated_profile_pic');
                this.router.navigate(['/']);
            })
            .catch(error => {
                console.log(error);
            })
    }

}