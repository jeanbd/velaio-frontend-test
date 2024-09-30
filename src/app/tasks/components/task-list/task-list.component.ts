import { CommonModule } from '@angular/common';

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
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
import { Subscription } from 'rxjs';



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
export class TaskListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    private taskService:TasksService
  ) { }

  /**
   * Variables para almacenar lista de tareas
   */
  private tasksSubscription?: Subscription;
  public tasksFromResponse: Task[] = [];
  public dataTasks: Task[] = [];

  /**
   * Variables para filtros
   */
  isCollapsedAll: boolean = false;
  completeActivated: boolean = false;
  pendingActivated: boolean = false;

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  /**
   * Carga datos al renderizar
   */
  ngOnInit(): void {
    this.getTasks();
    this.tasksSubscription = this.taskService.tasksObservable.subscribe(tasks => {
      this.tasksFromResponse = this.dataTasks = tasks;
    });
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }
 
  /**
   * Llama al servicio del get de tareas
   */
  getTasks(){
    this.taskService.getTasks().subscribe( response => {
      this.tasksFromResponse= this.dataTasks= response
    })
  }
  

  trackById(index: number): number {
    return index; // Usa una clave única como 'id'
  }

  /**
   * Activa filtro de tareas pendientes
   */
  pendingFilter() {
    this.dataTasks = this.tasksFromResponse;
    this.dataTasks = this.dataTasks?.filter(e => e.status == false);
    this.isCollapsedAll = false
    this.accordion.closeAll()
    this.pendingActivated = true;
    this.completeActivated = false;

  }

  /**
   * Activa filtro de tareas completadas
   */
  completeFilter() {
    this.dataTasks = this.tasksFromResponse;
    this.dataTasks = this.dataTasks?.filter(e => e.status == true);
    this.isCollapsedAll = false
    this.accordion.closeAll()
    this.pendingActivated = false;
    this.completeActivated = true;

  }

  /**
   * Limpia los filtros
   */
  cleanFilter() {
    this.dataTasks = this.tasksFromResponse;
    this.isCollapsedAll = false
    this.accordion.closeAll()
    this.pendingActivated = false;
    this.completeActivated = false

  }

  /**
   * Colapsa los acordeones
   */
  collapseAll() {
    this.isCollapsedAll = !this.isCollapsedAll
    this.isCollapsedAll == true ? this.accordion.openAll() : this.accordion.closeAll()
  }

  /**
   * Abri el modal para crear tarea
   */
  openCreaeTask() {
    this.dialog.open(CreateTaskComponent,{
      height: '400px',
      width: '600px',
    });
  }

  /**
   * Abre el modal para editar tarea
   */
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

  get dataTask():Task[]{
    const tasksList = this.dataTask
    return tasksList
  }

}
