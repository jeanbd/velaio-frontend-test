import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(
    private httpClient:HttpClient
  ) { }

  private baseUrl:string = 'http://localhost:3000/tasks';

  public tasksList?:Task[]

  get finalTaskList():Task[]|undefined{
    if(!this.tasksList) return undefined
    return structuredClone(this.tasksList)
  }

  getTasks():Observable<Task[]>{
    console.log('entro al get task del servicio')
    return this.httpClient.get<Task[]>(this.baseUrl).pipe(
      tap(
        response => this.tasksList=response
      )
    )
  };

  createTasks(task:Task):Observable<Task>{
    return this.httpClient.post<Task>(this.baseUrl,task);
  };

  updateTask(task:Task):Observable<Task>{
    console.log('esto es lo que llega al back',task)
    if(!task.id) throw Error('Se necesita el id del task');
    return this.httpClient.patch<Task>(`${this.baseUrl}/${task.id}`,task)
  }
}
