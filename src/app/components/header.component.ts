import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskboardsService } from './taskboards.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  username: string;
  teamId: string;
  profilePicUrl: string;

  constructor(private taskboardsSvc: TaskboardsService, private authSvc: AuthService, private userSvc: UserService) { }

  ngOnInit() {
    this.username = JSON.parse(localStorage.getItem('user_data')).username;
    this.teamId = JSON.parse(localStorage.getItem('user_data')).team_id;
    if (!localStorage.getItem('updated_profile_pic'))
      this.profilePicUrl = `https://free-images.sgp1.digitaloceanspaces.com/profiles/${JSON.parse(localStorage.getItem('user_data')).profile_pic_url}`;
    else
      this.profilePicUrl = `https://free-images.sgp1.digitaloceanspaces.com/profiles/${localStorage.getItem('updated_profile_pic')}`;
  }

  logout() {
    this.taskboardsSvc.emit('leftRoom', {username: this.username, teamId: this.teamId});
    this.authSvc.logout();
  }

}
