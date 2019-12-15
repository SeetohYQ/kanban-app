import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { TaskboardsService } from '../components/taskboards.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authSvc: AuthService, private router: Router, private taskboardsSvc: TaskboardsService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree
                                                                        | Promise<boolean | UrlTree>
                                                                        | Observable<boolean | UrlTree> 
    {
        if (this.authSvc.authenticated)
            return true;

        if (!this.authSvc.authenticated && localStorage.getItem('user_data')) {
            try {
                //if any issue with local storage user_data like invalid format, and users keying in invalid format etc.
                JSON.parse(localStorage.getItem('user_data')).username;
                JSON.parse(localStorage.getItem('user_data')).team_id;
                JSON.parse(localStorage.getItem('user_data')).profile_pic_url;
                JSON.parse(localStorage.getItem('user_data')).token_type;
                JSON.parse(localStorage.getItem('user_data')).access_token;
            }
            catch(e) {
                return this.router.createUrlTree(['/']);
            }
            return true;
        }
        return this.router.createUrlTree(['/']);
    }

    canActivateChild() {
        if (!!localStorage.getItem('user_data') && !this.taskboardsSvc.boardIdForAddTask) 
            return this.router.createUrlTree(['/taskboards']);
        
        if (!localStorage.getItem('user_data')) {
            return true;
        }
        return true;
    }
}