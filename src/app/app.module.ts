import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskCardComponent } from './components/task-card.component';
import { TaskBoardComponent } from './components/task-board.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './material.modules';
import { CreateTaskComponent } from './components/create-task.component';
import { CreateUserComponent } from './components/create-user.component';
import { LoginComponent } from './components/login.component';
import { TaskBoardsComponent } from './components/task-boards.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog.component';
import { AuthInterceptorService } from './auth/auth-interceptor';
import { UpdateUserComponent } from './components/update-user.component';
import { HeaderComponent } from './components/header.component';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = { url: environment.serverUri, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    TaskCardComponent,
    TaskBoardComponent,
    CreateTaskComponent,
    CreateUserComponent,
    LoginComponent,
    TaskBoardsComponent,
    ConfirmDialogComponent,
    UpdateUserComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [ {
                provide: HTTP_INTERCEPTORS, 
                useClass: AuthInterceptorService, 
                multi: true
                }      
            ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialogComponent]
})
export class AppModule { }
