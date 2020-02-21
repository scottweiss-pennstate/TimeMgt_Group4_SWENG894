import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { SessionService } from "../services/session.service";
import { HttpHeaders } from '@angular/common/http';


export interface DialogData {
  name: string;
  category: string;
  description: string;
  ssDate: Date;
  ssTime: string;
  seDate: Date;
  seTime: string;
  asDate: Date;
  asTime: string;
  aeDate: Date;
  aeTime: string;
  number: string;
  id: number;
  token: string;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks;
  token;

  ngOnInit() {
    this.token = this.sessionService.getToken();
    console.log("EL token: " + this.token)

    const headers = { 'Authorization': 'Bearer ' + this.token
     }
    //console.log(headers);

    this.http.get('http://localhost:8001/tasks/', { headers }).subscribe({
    next: data => this.tasks = data,
    error: error => console.error('There was an error!', error)
    })

    //console.log(this.tasks);

  }

  //number = "1";
  constructor(public dialog: MatDialog, private http: HttpClient,
  private sessionService: SessionService ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(
    CreateTaskDialog, {
      //width: '250px',
      data: {
      token: this.token
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The create dialog was closed');
      console.log(result);
      
    });
  }

  openDeleteDialog(i: number): void {
    
    console.log();
    const dialogRef = this.dialog.open(
    ConfirmDeleteDialog, {
      //width: '250px',
      data: {
      id: i
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The delete dialog was closed');
      //this.animal = result;
    });
  }

  openEditDialog(i: number, index: number): void {
    const dialogRef = this.dialog.open(
    EditTaskDialog, {
      data: {
      task:  this.tasks[index],
      token: this.token
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The edit dialog was closed');
      console.log(result);
      //this.animal = result;
    });
  }



}

@Component({
  selector: 'create-task-dialog',
  templateUrl: 'create-task-dialog.html',
  styleUrls: ['./tasks.component.css']
})
export class CreateTaskDialog {

  scheduledStart;
  scheduledEnd;

  constructor(
    public dialogRef: MatDialogRef<CreateTaskDialog>,
    private http: HttpClient,
    private sessionService: SessionService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
  
    this.scheduledStart = this.dateConversion(this.data.ssTime, this.data.ssDate)
    this.scheduledEnd = this.dateConversion(this.data.seTime, this.data.seDate)

    console.log(this.scheduledStart);
    console.log(this.scheduledEnd);
    console.log("Before POST");

    const headers = { 'Authorization': 'Bearer ' + this.sessionService.getToken()}

    const body = { name: this.data.name,
    description: this.data.description,
    category: this.data.category,
    scheduledstart: this.scheduledStart,
    scheduledend: this.scheduledEnd,
     }

    this.http.post('http://localhost:8001/tasks/newtask', body, { headers }).subscribe({
    next: data => console.log(data),
    error: error => console.error('There was an error!', error)
    })


    this.dialogRef.close();
  }

  dateConversion(time: string, date: Date) : Date {
    var tempDate = date;
    var tempTime = time;
    console.log("IN dateconversion");
    var parts = tempTime.match(/(\d+):(\d+) (AM|PM)/);
    if (parts) {
        var hours = parseInt(parts[1]),
            minutes = parseInt(parts[2]),
            tt = parts[3];
        if (tt === 'PM' && hours < 12) hours += 12;
        date.setHours(hours, minutes, 0, 0);
    }

    return tempDate;
  }

  ngOnInit() {
    console.log(this.data.token);
  }

}

@Component({
  selector: 'confirm-delete-dialog',
  templateUrl: 'confirm-delete-dialog.html',
  styleUrls: ['./tasks.component.css']
})
export class ConfirmDeleteDialog {
  id;
  number;
  name;


  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialog>,
    private http: HttpClient,
    private sessionService: SessionService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {data: {
    }}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    console.log("BEFORE delete");
    const headers = { 'Authorization': 'Bearer ' + this.sessionService.getToken()}
    this.http.delete('http://localhost:8001/tasks/Tasks/' + this.data.id, { headers }).subscribe({
    next: data => console.log(data),
    error: error => console.error('There was an error!', error)
    })

    this.dialogRef.close();
  }

  ngOnInit() {
    this.id = this.data.id;
  }

}


@Component({
  selector: 'edit-task-dialog',
  templateUrl: 'edit-task-dialog.html',
  styleUrls: ['./tasks.component.css']
})
export class EditTaskDialog {

    id: number;
    task: any;
    showActuals: boolean;

    scheduledStart;
    scheduledEnd;
    actualStart;
    actualEnd;


  constructor(
    public dialogRef: MatDialogRef<EditTaskDialog>,
    private http: HttpClient,
    private sessionService: SessionService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {data: {

    }}

  onNoClick(): void {

    this.dialogRef.close();
  }

  onYesClick(): void {

    this.scheduledStart = this.dateConversion(this.task.ssTime, this.task.ssDate)
    this.scheduledEnd = this.dateConversion(this.task.seTime, this.task.seDate)
    this.actualStart = this.dateConversion(this.task.asTime, this.task.asDate)
    this.actualEnd = this.dateConversion(this.task.aeTime, this.task.aeDate)

    const headers = { 'Authorization': 'Bearer ' + this.sessionService.getToken()}

    const body = { 
    id: this.task.id,
    name: this.task.name,
    description: this.task.description,
    category: this.task.category,
    scheduledstart: this.scheduledStart,
    scheduledend: this.scheduledEnd,
    actualstart: this.actualStart,
    actualend: this.actualEnd

     }

    console.log("BEFORE put");
    this.http.put('http://localhost:8001/tasks/task', body, { headers }).subscribe({
    next: data => console.log(data),
    error: error => console.error('There was an error!', error)
    })


    this.dialogRef.close();
  }

  onActualsClick(): void {
    this.showActuals = true;
    console.log("Actual click");
  }

  dateConversion(time: string, date: Date) : Date {
    var tempDate = date;
    var tempTime = time;
    console.log("IN dateconversion");
    var parts = tempTime.match(/(\d+):(\d+) (AM|PM)/);
    if (parts) {
        var hours = parseInt(parts[1]),
            minutes = parseInt(parts[2]),
            tt = parts[3];
        if (tt === 'PM' && hours < 12) hours += 12;
        date.setHours(hours, minutes, 0, 0);
    }

    return tempDate;
  }


  ngOnInit() {
    this.showActuals = false;
    this.id = this.data.id;
    this.task = this.data.task;

    console.log("The task: ", this.task);

  }

}
