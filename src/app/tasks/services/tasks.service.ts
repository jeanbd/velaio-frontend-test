import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(
    private httpClient: HttpClient
  ) { }

  private baseUrl: string = 'http://localhost:3000/tasks';

  public tasksList?: Task[]

  get finalTaskList(): Task[] | undefined {
    if (!this.tasksList) return undefined
    return structuredClone(this.tasksList)
  }

  getTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(this.baseUrl).pipe(
      tap(
        response => {
          this.tasksList = response
          this.tasksSubject.next(response);
        }
      )
    )
  };

  createTasks(task: Task): Observable<Task> {
    return this.httpClient.post<Task>(this.baseUrl, task).pipe(
      tap(newTask => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next([...currentTasks, newTask]);
      })
    )
  };

  updateTask(task: Task): Observable<Task> {
    if (!task.id) throw Error('Se necesita el id del task');
    return this.httpClient.patch<Task>(`${this.baseUrl}/${task.id}`, task).pipe(
      tap(
        updatedTask => {
          const currentTasks = this.tasksSubject.value;
          const index = currentTasks.findIndex(t => t.id === updatedTask.id);
          if (index !== -1) {
            currentTasks[index] = updatedTask;
            this.tasksSubject.next([...currentTasks]);
          }
        }
      )
    )
  }
}
