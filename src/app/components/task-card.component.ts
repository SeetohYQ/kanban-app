import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { Task } from './task.model';
import { TaskboardsService } from './taskboards.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent implements OnInit, OnDestroy {

  @Input() task: Task;
  onReceiveTeamProfiles = new Subscription;
  teamProfiles: {username: string; profile_pic_url: string}[] = [];

  taskForm: FormGroup;
  checkList: FormArray = new FormArray([]);

  status = ['planned', 'wip', 'completed'];
  assignedToPic: string;
  username: string;
  teamId: string;

  constructor(private taskboardsSvc: TaskboardsService, private dialog: MatDialog) { }

  ngOnInit() {
    if (!!this.task) {
      if (this.task.checklist.length > 0) {
        this.task.checklist.forEach(t => {
          const list_item = new FormControl(t.list_item, Validators.required);
          const completed = new FormControl(t.completed);
          this.checkList.push(new FormGroup({
            completed,
            list_item
          })
          )
        })
      }

      const assigned = this.task.assigned_to || null;
      this.taskForm = new FormGroup({
        'title': new FormControl(this.task.title, Validators.required),
        'description': new FormControl(this.task.description || ''),
        'checkList': this.checkList,
        'dueDate': new FormControl(this.task.due_date, this.validateDueDate.bind(this)),
        'assignedTo': new FormControl(assigned)
      })

    }
    this.username = JSON.parse(localStorage.getItem('user_data')).username;
    this.teamId = JSON.parse(localStorage.getItem('user_data')).team_id;
    
    this.onReceiveTeamProfiles = this.taskboardsSvc.onReceiveTeamProfiles.subscribe(result => {
        if (!!this.task.assigned_to) {
          this.assignedToPic = `https://free-images.sgp1.digitaloceanspaces.com/profiles/`;
          this.assignedToPic += result.find(v => v.username === this.task.assigned_to).profile_pic_url;
        }
        else {
          this.assignedToPic = `https://free-images.sgp1.digitaloceanspaces.com/profiles/`;
          this.assignedToPic += result.find(v => v.username === 'unassigned').profile_pic_url;
        }
        this.teamProfiles = result;
    })
  }

  updateTaskDetails() {
    const updatedTask: Task = {
      task_id: this.task.task_id,
      title: this.taskForm.value['title'],
      description: this.taskForm.value['description'],
      assigned_to: this.taskForm.value['assignedTo'],
      due_date: this.taskForm.value['dueDate'],
      checklist: this.taskForm.value['checkList']
    }
    this.taskboardsSvc.emit('updateTaskDetails', { updatedTask, username: this.username, teamId: this.teamId });
  }

  addToCheckList() {
    const list_item = new FormControl('', Validators.required);
    const completed = new FormControl(false);

    this.checkList.push(new FormGroup({
      completed,
      list_item
    })
    )
  }

  deleteFromCheckList(index: number) {
    this.checkList.removeAt(index);
  }

  updateProgress(updatedStatus: string) {
    this.taskboardsSvc.emit('updateTaskStatus', { taskId: this.task.task_id, updatedStatus, username: this.username, teamId: this.teamId });
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(ConfirmDialogComponent, dialogConfig).afterClosed().subscribe(value => {
      if (value)
        this.taskboardsSvc.emit('deleteTask', { taskId: this.task.task_id, username: this.username, teamId: this.teamId });
    })
  }

  validateDueDate(control: FormControl): ValidationErrors {
    if (control.value < new Date()) {
      return { error: 'Date should be later than today' }
    }
    return null;
  }

  ngOnDestroy() {
    this.onReceiveTeamProfiles.unsubscribe();
  }

}
