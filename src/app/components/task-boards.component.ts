import { Component, OnInit } from '@angular/core';
import { TaskboardsService } from './taskboards.service';
import { TaskBoard } from './task.model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-task-boards',
  templateUrl: './task-boards.component.html',
  styleUrls: ['./task-boards.component.css']
})
export class TaskBoardsComponent implements OnInit {

  taskBoards: TaskBoard[];
  username: string;
  teamId: string;

  constructor(private taskboardsSvc: TaskboardsService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.username = JSON.parse(localStorage.getItem('user_data')).username;
    this.teamId = JSON.parse(localStorage.getItem('user_data')).team_id;

    this.taskboardsSvc.emit('joinRoom',  { username: this.username, teamId: this.teamId });
    this.taskboardsSvc.emit('getTaskBoards', { username: this.username, teamId: this.teamId });

    this.taskboardsSvc.getData('boards').subscribe(data => {
      this.taskBoards = data;

      //To retrieve team profiles
      this.taskboardsSvc.getProfilesForTeam(this.teamId);
    })

    this.taskboardsSvc.getData('joinRoom').subscribe(data => {
      console.log(data);
      this._snackBar.open(data, 'OK', {
        duration: 2000,
      });
    })

    //For update task board name
    this.taskboardsSvc.getData('newBoardName').subscribe(data => {
      this.taskboardsSvc.emit('getTaskBoards', { username: this.username, teamId: this.teamId });
    })

    //For other successful CRUD operations with its details contained in data.
    this.taskboardsSvc.getData('success').subscribe(data => {
      if (data.includes('updated task details')) {
        console.log(data);
      }
      this._snackBar.open(data, 'OK', {
        duration: 2000,
      });
      //To 'refresh' the task boards
      this.taskboardsSvc.emit('getTaskBoards', { username: this.username, teamId: this.teamId });
    })

    this.taskboardsSvc.getData('error').subscribe(error => {
      this._snackBar.open('Error', 'OK', {
        duration: 2000,
      });
    })

    //When user logs out/navigate to update profile
    this.taskboardsSvc.getData('leftRoom').subscribe(data => {
      this._snackBar.open(data, 'OK', {
        duration: 2000,
      });
    })

  }

  createTaskboard() {
    this.taskboardsSvc.emit('createTaskBoard', { username: this.username, teamId: this.teamId });
  }

}
