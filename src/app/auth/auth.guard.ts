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
        if (!!localStorage.getItem('user_data'))
            return true;
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