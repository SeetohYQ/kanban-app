import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTaskComponent } from './components/create-task.component';
import { CreateUserComponent } from './components/create-user.component';
import { LoginComponent } from './components/login.component';
import { TaskBoardsComponent } from './components/task-boards.component';
import { AuthGuard } from './auth/auth.guard';
import { UpdateUserComponent } from './components/update-user.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'user/create', component: CreateUserComponent },
  { path: 'user/update', component: UpdateUserComponent, 
    canActivate: [ AuthGuard ],
  },
  { path: 'taskboards', component: TaskBoardsComponent, 
    canActivate: [ AuthGuard ],
    canActivateChild: [ AuthGuard ],
    children: [{
    path: 'create', component: CreateTaskComponent
  }] },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
