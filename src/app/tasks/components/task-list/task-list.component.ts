import { CommonModule } from '@angular/common';

import { Component, OnInit,ViewChild } from '@angular/core';
import tasks from '../../../../mocks/tareas.json';
import { Task } from '../../interfaces/task.interface';

import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatNativeDateModule} from '@angular/material/core';


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
  ],
})
export class TaskListComponent implements OnInit {
  ngOnInit(): void {
    console.log('estos son los taks', tasks)
  }
  dataTasks:Task[] = tasks
  @ViewChild(MatAccordion) accordion!: MatAccordion;
}
