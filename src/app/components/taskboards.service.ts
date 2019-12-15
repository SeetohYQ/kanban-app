import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class TaskboardsService {

    serverUri = environment.serverUri;
    //to store board id for updating task instead of passing through routes for security purpose
    boardIdForAddTask: number;
    observable: Observable<any>;
    teamProfiles: {username: string; profile_pic_url: string}[] = [];
    onReceiveTeamProfiles: Subject<{username: string; profile_pic_url: string}[]>= new Subject<{username: string; profile_pic_url: string}[]>();

    constructor(private http: HttpClient, private socket: Socket, private router: Router) { }

    getData(request: string): Observable<any> {
        return this.observable = new Observable<any>((observer) => 
          this.socket.on(request, (data) => observer.next(data))
        );
    }

    emit(message: string, data: any) {
        this.socket.emit(message, data);
    }
    
    getProfilesForTeam(teamId: string) {
        return this.http.get<{username: string;  profile_pic_url: string}[]>(`${this.serverUri}/api/users/team/${teamId}`).toPromise()
            .then(result => {
                this.teamProfiles = result;
                this.onReceiveTeamProfiles.next(this.teamProfiles);
            })
            .catch(error => {
                this.router.navigate(['/']);
            });
    }

}