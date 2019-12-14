import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Team, User } from './user.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    serverUrl = environment.serverUri;

    constructor(private http: HttpClient) {}

    getTeams(): Promise<Team[]> {
        return this.http.get<Team[]>(`${this.serverUrl}/api/teams`).toPromise();
    }

    getUserProfile(username: string): Promise<User> {
        return this.http.get<User>(`${this.serverUrl}/api/users/${username}`).toPromise();
    }

    createUser(newUser: FormData) {
        return this.http.post(`${this.serverUrl}/api/users`, newUser).toPromise();
    }

    updateUser(updatedUser: FormData, username: string): Promise<{updated_profile_pic_url: string}> {
        return this.http.put<{updated_profile_pic_url: string}>(`${this.serverUrl}/api/users/${username}`, updatedUser).toPromise();
    }
}