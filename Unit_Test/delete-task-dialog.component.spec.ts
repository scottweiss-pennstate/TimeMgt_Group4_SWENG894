/** Linked Issue: TMGP4-30: Delete Task
 *
 *  Author: Chavarria Leo
 *
 *  Unit Test - Frontend
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule} from '@angular/material/icon';
import {CustomMaterialModule} from '../../modules/material.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AmplifyService} from 'aws-amplify-angular';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeleteTaskDialogComponent } from './delete-task-dialog.component';
import {
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatButtonModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import {ConfirmTaskDialogComponent} from "../confirm-task-dialog/confirm-task-dialog.component";
import {By} from "@angular/platform-browser";

describe('DeleteTaskDialogComponent', () => {
  let component: DeleteTaskDialogComponent;
  let fixture: ComponentFixture<DeleteTaskDialogComponent>;

  beforeEach(async(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
        platformBrowserDynamicTesting());
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        MatIconModule,
        MatSelectModule,
        CustomMaterialModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
      ],
      providers: [AmplifyService, HttpClient, {
        provide: MatDialogRef,
        useValue: {}},
        { provide: MAT_DIALOG_DATA, useValue: {}}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ DeleteTaskDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify onNoClick', () => {
    expect(component.onNoClick).toBeTruthy();
  });

  it('should verify onYesClick', () => {
    expect(component.onYesClick).toBeTruthy();
  });

  it('should set on No Click', () => {
    const fixture = TestBed.createComponent(DeleteTaskDialogComponent);
    const alert = 'Cancel Message';
    fixture.detectChanges();

    const h1 = fixture.debugElement.query(By.css('button'));
    h1.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('button')).nativeElement.innerText).toEqual('No');
  });
/**
  it('should set on Yes Click', () => {
    const fixture = TestBed.createComponent(DeleteTaskDialogComponent);
    fixture.detectChanges();

    const h1 = fixture.debugElement.query(By.css('button'));
    h1.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('button')).nativeElement.innerText).toEqual('Yes');
  });
 */
});
