/**
 *
 * Author(s): Yanisse/Asma
 * Jira Task: N/A
 * Description: The main module routing code for application. Holds the routes/links used in the application for the
 * app's navigation.
 *
 **/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { SecureComponent } from './components/secure/secure.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { BrowserModule } from '@angular/platform-browser';
import { TasksComponent } from './components/tasks/tasks.component';
import { TaskCategoryComponent } from './components/task-category/task-category.component';
import { ReportComponent } from './components/report/report.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: AuthComponent, pathMatch: 'full' },
  { path: 'tasks', component: TasksComponent, pathMatch: 'full' },
  { path: 'category', component: TaskCategoryComponent, pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, pathMatch: 'full'},
  { path: 'report', component: ReportComponent, pathMatch: 'full' }
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes), AmplifyAngularModule, BrowserModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}
