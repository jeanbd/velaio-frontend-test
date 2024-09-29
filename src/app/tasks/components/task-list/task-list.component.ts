import { CommonModule } from '@angular/common';

import { Component, OnInit, ViewChild } from '@angular/core';
import tasks from '../../../../mocks/tareas.json';
import { Task } from '../../interfaces/task.interface';

import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateTaskComponent } from '../create-task/create-task.component';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styles: [
  ],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule

  ],
})
export class TaskListComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log('estos son los taks', tasks)
  }
  dataTasks: Task[] = tasks
  isCollapsedAll: boolean = false;
  completeActivated: boolean = false;
  pendingActivated: boolean = false;

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  trackById(index: number): number {
    return index; // Usa una clave única como 'id'
  }

  pendingFilter() {
    this.dataTasks = tasks;
    this.dataTasks = this.dataTasks.filter(e => e.status == false);
    this.isCollapsedAll = false
    this.accordion.closeAll()
    this.pendingActivated = true;
    this.completeActivated = false;

  }

  completeFilter() {
    this.dataTasks = tasks;
    this.dataTasks = this.dataTasks.filter(e => e.status == true);
    this.isCollapsedAll = false
    this.accordion.closeAll()
    this.pendingActivated = false;
    this.completeActivated = true;

  }

  cleanFilter() {
    this.dataTasks = tasks;
    this.isCollapsedAll = false
    this.accordion.closeAll()
    this.pendingActivated = false;
    this.completeActivated = false

  }

  collapseAll() {
    this.isCollapsedAll = !this.isCollapsedAll
    this.isCollapsedAll == true ? this.accordion.openAll() : this.accordion.closeAll()
  }

  openCreaeTask() {
    this.dialog.open(CreateTaskComponent,{
      height: '400px',
      width: '600px',
    });
  }

  openEditTask(task: Task) {
    this.dialog.open(CreateTaskComponent, {
      height: '400px',
      width: '600px',
      data: {
        isEditing: true,
        task
      },
      
    });
  }

}
