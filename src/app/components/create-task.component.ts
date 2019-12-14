import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskboardsService } from './taskboards.service';
import { Task } from './task.model';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {

  taskForm: FormGroup;
  checkList: FormArray = new FormArray([]);
  board_id: number;
  status: string;
  username: string;
  teamId: string;

  constructor(private route: ActivatedRoute, private router: Router, private taskboardsSvc: TaskboardsService) { }

  ngOnInit() {
    this.status = this.route.snapshot.queryParams['status'];

    this.taskForm = new FormGroup({
      'title': new FormControl('', Validators.required),
      'description': new FormControl(''),
      'checkList': this.checkList
    })
    this.username = JSON.parse(localStorage.getItem('user_data')).username;
    this.teamId =  JSON.parse(localStorage.getItem('user_data')).team_id;
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

  createTask() {
    const task: Task = this.taskForm.value;
    task.board_id = this.taskboardsSvc.boardIdForAddTask;
    task.status = this.status;
    this.taskboardsSvc.emit('createTask', { task, username: this.username, teamId: this.teamId });
    this.router.navigate(['../'], { relativeTo: this.route });

  }
}
