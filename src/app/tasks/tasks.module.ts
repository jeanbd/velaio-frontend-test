import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { TaskListComponent } from './components/task-list/task-list.component';


@NgModule({
  declarations: [
    ListPageComponent,
    // TaskListComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
  ]
})
export class TasksModule { }
