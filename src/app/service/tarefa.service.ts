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

  editar(tarefa: Tarefa): Observable<Tarefa> {
    const url = `${this.API}/${tarefa.id}`;
    return this.http.put<Tarefa>(url, tarefa);
  }

  excluir(id: number): Observable<Tarefa> {
    const url = `${this.API}/${id}`;
    return this.http.delete<Tarefa>(url);
  }

  buscarPorId(id: number): Observable<Tarefa> {
    const url = `${this.API}/${id}`;
    return this.http.get<Tarefa>(url);
  }

  atualizarStatusTarefa(tarefa: Tarefa): Observable<Tarefa> {
    tarefa.statusFinalizado = !tarefa.statusFinalizado;
    return this.editar(tarefa);
  }
}
