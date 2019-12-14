import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TaskboardsService } from './taskboards.service';
import { Task, TaskBoard } from './task.model';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css']
})
export class TaskBoardComponent implements OnInit {
  @Input() taskBoard: TaskBoard;

  plannedTasks: Task[] = [];
  wipTasks: Task[] = [];
  completedTasks: Task[] = [];
  boardName: string;
  username: string;
  teamId: string;

  constructor(private taskboardsSvc: TaskboardsService, private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    this.username = JSON.parse(localStorage.getItem('user_data')).username;
    this.teamId = JSON.parse(localStorage.getItem('user_data')).team_id;

    if (this.taskBoard.tasks.length > 0) {
      this.taskBoard.tasks.forEach(r => {
        if (r.status === 'planned')
          this.plannedTasks.push(r);
        else if (r.status === 'wip')
          this.wipTasks.push(r);
        else if (r.status === 'completed')
          this.completedTasks.push(r);
      })
      this.boardName = this.taskBoard.board_name;
    }
  }

  addTask(status: string, board_id: number) {
    this.taskboardsSvc.boardIdForAddTask = board_id;
    this.router.navigate(['taskboards', 'create'], { queryParams: { status } });
  }

  openDialog(board_id: number) {
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(ConfirmDialogComponent, dialogConfig).afterClosed().subscribe(value => {
      if (value)
        this.taskboardsSvc.emit('deleteTaskBoard', { board_id, username: this.username, teamId: this.teamId });
    })
  }

  updateTaskboardName(form: NgForm) {
    this.taskboardsSvc.emit('updateTaskBoardName', { board_id: this.taskBoard.board_id, board_name: form.value.boardName, 
                                                      username: this.username, teamId: this.teamId });
  }

}
