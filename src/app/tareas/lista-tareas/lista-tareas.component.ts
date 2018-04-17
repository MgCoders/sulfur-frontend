import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { AltaTareaComponent } from '../alta-tarea/alta-tarea.component';
import { TareaService } from '../../_services/tarea.service';
import { AlertService } from '../../_services/alert.service';
import { TipoTarea } from '../../_models/models';
import { LayoutService } from '../../layout/layout.service';
import { DialogConfirmComponent } from '../../shared/dialog-confirm/dialog-confirm.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-lista-tareas',
  templateUrl: './lista-tareas.component.html',
  styleUrls: ['./lista-tareas.component.scss']
})
export class ListaTareasComponent implements OnInit {

  public lista: TipoTarea[];
  public showIdColumns: boolean;

  constructor(public dialog: MatDialog,
              private service: TareaService,
              private as: AlertService,
              private layoutService: LayoutService) { }

  ngOnInit() {
    this.lista = new Array();
    this.showIdColumns = environment.showIdColumns;

    this.layoutService.updatePreloaderState('active');
    this.service.getAll().subscribe(
      (data) => {
        this.lista = data;
        this.lista.sort((a: TipoTarea, b: TipoTarea) => {
          return b.prioridad - a.prioridad;
        });
        this.layoutService.updatePreloaderState('hide');
      },
      (error) => {
        this.layoutService.updatePreloaderState('hide');
        this.as.error(error, 5000);
      });
  }

  Nuevo() {
    const dialog = this.dialog.open(AltaTareaComponent, {
      data: [undefined, this.lista],
      width: '600px',
    });
  }

  Eliminar(x: TipoTarea) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: '¿Está seguro que desea eliminar la tarea ' + x.nombre + '?',
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          // TODO
          this.as.success('Tarea eliminada correctamente.', 3000);
        }
      });
  }

  Editar(x: TipoTarea) {
    const dialog = this.dialog.open(AltaTareaComponent, {
      data: [x, this.lista],
      width: '600px',
    });
  }
}
