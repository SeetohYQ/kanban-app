import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from './user.service';
import { Team } from './user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup;
  teams: Team[];
  file: File = null;
  uploadedImageUrl: any;
  username: string;

  constructor(private userSvc: UserService, private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userForm = new FormGroup({
      'username': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'teamName': new FormControl('', Validators.required),
      'profilePic': new FormControl(null, Validators.required)
    })

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
    formData.append('username', this.userForm.get('username').value);
    formData.append('password', this.userForm.get('password').value);
    formData.append('email', this.userForm.get('email').value);
    formData.append('teamId', this.userForm.get('teamName').value);
    formData.append('profilePic', this.file);
    this.userSvc.createUser(formData)
      .then(result => {
          this._snackBar.open('Created. Please log in.', 'OK', {
            duration: 2000,
          });
          this.router.navigate(['/']);
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

}
