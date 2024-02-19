import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Tarefa } from '../interface/tarefa';

@Injectable({
  providedIn: 'root',
})
export class TarefaService {
  private readonly API = 'http://localhost:3000/tarefas';
  private tasksSubject = new BehaviorSubject<Tarefa[]>([]);

  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  listar(): void {
    let params = new HttpParams().appendAll({
      _sort: 'id',
      _order: 'desc',
    });
    this.http.get<Tarefa[]>(this.API, { params }).subscribe((tasks) => {
      let tempTasks = this.tasksSubject.getValue();
      tempTasks = tempTasks.concat(tasks);
      this.tasksSubject.next(tempTasks);
    });
  }

  criar(tarefa: Tarefa): void {
    this.http.post<Tarefa>(this.API, tarefa).subscribe((newTask) => {
      const tasks = this.tasksSubject.getValue();
      tasks.unshift(newTask);
      this.tasksSubject.next(tasks);
    });
  }

  editar(tarefa: Tarefa, atualizarSubject: boolean): void {
    const url = `${this.API}/${tarefa.id}`;
    this.http.put<Tarefa>(url, tarefa).subscribe((editedTask) => {
      if (atualizarSubject) {
        const tasks = this.tasksSubject.getValue();
        const index = tasks.findIndex((task) => task.id === editedTask.id);

        if (index > -1) {
          tasks[index] = editedTask;
          this.tasksSubject.next(tasks);
        }
      }
    });
  }

  excluir(id: number): void {
    const url = `${this.API}/${id}`;
    this.http.delete<Tarefa>(url).subscribe(() => {
      const tasks = this.tasksSubject.getValue();
      const index = tasks.findIndex((task) => task.id === id);

      if (index > -1) {
        tasks.splice(index, 1);
        this.tasksSubject.next(tasks);
      }
    });
  }

  buscarPorId(id: number): Observable<Tarefa> {
    const url = `${this.API}/${id}`;
    return this.http.get<Tarefa>(url);
  }

  atualizarStatusTarefa(tarefa: Tarefa): void {
    tarefa.statusFinalizado = !tarefa.statusFinalizado;
    this.editar(tarefa, false);
  }
}
