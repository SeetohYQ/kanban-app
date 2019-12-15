import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { Team, User } from './user.model';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { MatSnackBar, ErrorStateMatcher } from '@angular/material';
import { TaskboardsService } from './taskboards.service';
import { HttpErrorResponse } from '@angular/common/http';

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid && control.touched;
  }
}

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  userForm: FormGroup;
  errorMatcher = new CrossFieldErrorMatcher();

  teams: Team[];
  file: File = null;
  uploadedImageUrl: any;
  username: string;
  teamId: string;
  profilePic: string;
  currentProfilePic: string;
  user: User;

  constructor(private userSvc: UserService, private taskboardsSvc: TaskboardsService,
              private router: Router, private _snackBar: MatSnackBar, private fb: FormBuilder) { }

  ngOnInit() {
    this.username = JSON.parse(localStorage.getItem('user_data')).username;
    this.teamId = JSON.parse(localStorage.getItem('user_data')).team_id;
    
    this.taskboardsSvc.emit('leftRoom', {username: this.username, teamId: this.teamId});

    this.userSvc.getUserProfile(this.username)
      .then(result => {
        this.userForm.get('email').setValue(result.email);
        this.profilePic = `https://free-images.sgp1.digitaloceanspaces.com/profiles/${result.profile_pic_url}`;
        this.currentProfilePic = result.profile_pic_url;
      })
      .catch(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) 
          //when tokens expire or fake tokens are manually entered
          this.router.navigate(['/']);
      })

    this.userForm = this.fb.group({
      'password': new FormControl(null, Validators.required),
      'confirmPassword': new FormControl(null),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'profilePic': new FormControl(null, Validators.required)
    }, { validators: this.passwordValidator })

    this.userSvc.getTeams()
      .then(result => {
        this.teams = result;
      })
      .catch(error => {
        console.log(error);
      })
  }

  processForm() {
    const formData = new FormData();
    formData.append('password', this.userForm.get('password').value);
    formData.append('email', this.userForm.get('email').value);
    formData.append('profilePic', this.file);
    formData.append('currentProfilePic', this.currentProfilePic);
    formData.append('currentTeamId', JSON.parse(localStorage.getItem('user_data')).team_id);

    this.userSvc.updateUser(formData, this.username)
      .then(result => {
          this._snackBar.open('Updated', 'OK', {
            duration: 2000,
          });
          localStorage.setItem('updated_profile_pic', result.updated_profile_pic_url);

          this.taskboardsSvc.emit('joinRoom',  { username: this.username, teamId: this.teamId });
          this.router.navigate(['/taskboards']);
      })
      .catch(error => {
        this._snackBar.open('An error occurred', 'OK', {
          duration: 2000,
        });
      });
  }

  newFile(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];

      //to preview image
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = (_event) => {
        this.uploadedImageUrl = reader.result;
      }
    }
  }

  passwordValidator(form: FormGroup) {
    const condition = form.get('password').value !== form.get('confirmPassword').value;
    if (!condition)
      form.get('confirmPassword').markAsPristine();
    return condition ? { passwordsMismatch: true } : null;
  }

}
