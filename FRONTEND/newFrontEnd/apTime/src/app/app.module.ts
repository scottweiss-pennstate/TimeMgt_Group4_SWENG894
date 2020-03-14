import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SecureComponent } from './components/secure/secure.component';
import { HomeComponent } from './components/home/home.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { NotificationModule } from './components/notification';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl
} from '@angular/forms';
import { CustomMaterialModule } from './modules/material.module';


import { MatMenuModule } from '@angular/material/menu';

import { FlexLayoutModule } from '@angular/flex-layout';

import { TaskCategoryComponent } from './components/task-category/task-category.component';
import { CreateTaskDialogComponent } from './components/create-task-dialog/create-task-dialog.component';
import { DeleteTaskDialogComponent } from './components/delete-task-dialog/delete-task-dialog.component';
import { EditTaskDialogComponent } from './components/edit-task-dialog/edit-task-dialog.component';
import { StartTaskDialogComponent } from './components/start-task-dialog/start-task-dialog.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ProfileComponent,
    SecureComponent,
    HomeComponent,
    TasksComponent,
    TaskCategoryComponent,
    CreateTaskDialogComponent,
    DeleteTaskDialogComponent,
    EditTaskDialogComponent,
    StartTaskDialogComponent,
    DashboardComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    AmplifyAngularModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    MatMenuModule,
    CustomMaterialModule,
    NotificationModule
  ],
  providers: [AmplifyService, CustomMaterialModule],
  bootstrap: [AppComponent],

  entryComponents: [
  CreateTaskDialogComponent,
    DeleteTaskDialogComponent,
    EditTaskDialogComponent,
    StartTaskDialogComponent
  ]

})
export class AppModule {}
