import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { TarefaService } from 'src/app/service/tarefa.service';
import {
  checkButtonTrigger,
  filterTrigger,
  flyInOutTrigger,
  formButtonTrigger,
  highlightedStateTrigger,
  listStateTrigger,
  shakeAnimationTrigger,
  shownStateTrigger,
} from '../animations/animations';
import { Tarefa } from '../interface/tarefa';

@Component({
  selector: 'app-lista-tarefas',
  templateUrl: './lista-tarefas.component.html',
  styleUrls: ['./lista-tarefas.component.css'],
  animations: [
    highlightedStateTrigger,
    shownStateTrigger,
    checkButtonTrigger,
    filterTrigger,
    formButtonTrigger,
    flyInOutTrigger,
    shakeAnimationTrigger,
    listStateTrigger,
  ],
})
export class ListaTarefasComponent implements OnInit {
  listaTarefas: Tarefa[] = [];
  formAberto: boolean = false;
  categoria: string = '';
  validado: boolean = false;
  indexTarefa: number = -1;
  currentId: number = -1;
  campoBusca: string = '';
  filteredTasks: Tarefa[] = [];
  tarefasSubscription: Subscription = new Subscription();
  formulario: FormGroup = this.fomBuilder.group({
    id: [0],
    descricao: ['', Validators.required],
    statusFinalizado: [false, Validators.required],
    categoria: ['', Validators.required],
    prioridade: ['', Validators.required],
  });
  estadoBotao: 'checked' | 'unchecked' = 'unchecked';

  constructor(
    private service: TarefaService,
    private fomBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.service.listar();

    this.tarefasSubscription = this.service.tasks$.subscribe((listaTarefas) => {
      this.listaTarefas = listaTarefas;
      this.filteredTasks = listaTarefas;
    });
  }

  filterTasksByDescription(searchString: string) {
    this.campoBusca = searchString.trim().toLowerCase();
    if (this.campoBusca) {
      this.filteredTasks = this.listaTarefas.filter((task) =>
        task.descricao.toLowerCase().includes(this.campoBusca)
      );
    } else {
      this.filteredTasks = this.listaTarefas;
    }
  }

  mostrarOuEsconderFormulario() {
    this.formAberto = !this.formAberto;
    this.resetarFormulario();
  }

  salvarTarefa() {
    if (this.formulario.value.id) {
      this.editarTarefa();
    } else {
      this.criarTarefa();
    }
  }

  editarTarefa() {
    if (this.formulario.valid) {
      const editedTask = this.formulario.value;
      this.service.editar(editedTask, true);
      this.resetarFormulario();
    }
  }

  criarTarefa() {
    if (this.formulario.valid) {
      const newTask = this.formulario.value;
      this.service.criar(newTask);
      this.resetarFormulario();
    }
  }

  excluirTarefa(tarefa: Tarefa) {
    if (tarefa.id) {
      this.service.excluir(tarefa.id);
    }
  }

  cancelar() {
    this.resetarFormulario();
    this.formAberto = false;
  }

  resetarFormulario() {
    this.formulario.reset({
      descricao: '',
      statusFinalizado: false,
      categoria: '',
      prioridade: '',
    });
  }

  carregarParaEditar(id: number) {
    this.service.buscarPorId(id!).subscribe((tarefa) => {
      this.formulario = this.fomBuilder.group({
        id: [tarefa.id],
        descricao: [tarefa.descricao],
        categoria: [tarefa.categoria],
        statusFinalizado: [tarefa.statusFinalizado],
        prioridade: [tarefa.prioridade],
      });
    });
    this.formAberto = true;
  }

  finalizarTarefa(tarefa: Tarefa) {
    this.currentId = tarefa.id;

    this.service.atualizarStatusTarefa(tarefa);

    this.estadoBotao = tarefa.statusFinalizado ? 'checked' : 'unchecked';
  }

  habilitarBotao(): string {
    if (this.formulario.valid) {
      return 'botao-salvar';
    } else return 'botao-desabilitado';
  }

  campoValidado(campoAtual: string): string {
    if (
      this.formulario.get(campoAtual)?.errors &&
      this.formulario.get(campoAtual)?.touched
    ) {
      this.validado = false;
      return 'form-tarefa input-invalido';
    } else {
      this.validado = true;
      return 'form-tarefa';
    }
  }
}
