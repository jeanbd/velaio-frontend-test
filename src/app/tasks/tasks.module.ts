import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { CreateTaskComponent } from './components/create-task/create-task.component';


@NgModule({
  declarations: [
    ListPageComponent,
    // CreateTaskComponent,
    // TaskListComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
  ]
})
export class TasksModule { }
