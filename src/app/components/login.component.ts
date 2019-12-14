import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  authenticationError = false;

  constructor(private authSvc: AuthService, private router: Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'username': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    })
  }

  processLogin() {
    this.authSvc.authenticateLogin(this.loginForm.value)
      .then(result => {
        this.authSvc.autoLogout();
        this.router.navigate(['/taskboards']);
      })
      .catch(error => {
        this.authenticationError = true;
      })
  }
}
