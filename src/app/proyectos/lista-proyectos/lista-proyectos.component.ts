import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { AltaProyectoComponent } from '../alta-proyecto/alta-proyecto.component';
import { ProyectoService } from '../../_services/proyecto.service';
import { AlertService } from '../../_services/alert.service';
import { Proyecto } from '../../_models/models';
import { LayoutService } from '../../layout/layout.service';
import { DialogConfirmComponent } from '../../shared/dialog-confirm/dialog-confirm.component';
import { environment } from '../../../environments/environment';
import { DialogInfoComponent } from '../../shared/dialog-info/dialog-info.component';

@Component({
  selector: 'app-lista-proyectos',
  templateUrl: './lista-proyectos.component.html',
  styleUrls: ['./lista-proyectos.component.scss']
})
export class ListaProyectosComponent implements OnInit {

  public lista: Proyecto[];
  public headers: number[] = [0,0,0,0];
  public showIdColumns: boolean;

  constructor(public dialog: MatDialog,
              private service: ProyectoService,
              private as: AlertService,
              private layoutService: LayoutService) { }

  ngOnInit() {
    this.lista = new Array();
    this.showIdColumns = environment.showIdColumns;

    this.layoutService.updatePreloaderState('active');
    this.service.getAll().subscribe(
      (data) => {
        this.lista = data;
        this.lista.sort((a: Proyecto, b: Proyecto) => {
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
    const dialog = this.dialog.open(AltaProyectoComponent, {
      data: [undefined, this.lista],
      width: '600px',
    });

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          // TODO
          this.as.success('Proyecto eliminado correctamente.', 3000);
        }
      });
  }

  Eliminar(x: Proyecto) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: '¿Está seguro que desea eliminar el proyecto ' + x.nombre + '?',
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        this.lista.sort((a: Proyecto, b: Proyecto) => {
          return b.prioridad - a.prioridad;
        });
      });
  }

  Editar(x: Proyecto) {
    const dialog = this.dialog.open(AltaProyectoComponent, {
      data: [x, this.lista],
      width: '600px',
    });

    dialog.afterClosed().subscribe(
      (result) => {
        this.lista.sort((a: Proyecto, b: Proyecto) => {
          return b.prioridad - a.prioridad;
        });
      });
  }

  VerObservaciones(x: string) {
    const dialogRef = this.dialog.open(DialogInfoComponent, {
      data: ['Observaciones', x],
      width: '600px',
    });
  }

  SortOnclick(evt: {field: string, direction: number}) {
    this.lista = this.lista.sort((a, b) => {
      switch (evt.field) {
        case 'nombre': return this.compare(a.nombre, b.nombre, evt.direction);
        case 'codigo': return this.compare(a.codigo, b.codigo, evt.direction);
        case 'prioridad': return this.compare(a.prioridad, b.prioridad, evt.direction);
        case 'enabled': return this.compare(a.enabled ? 1 : 0, b.enabled ? 1 : 0, evt.direction);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, order: number) {
    let auxA = Number(a);
    let auxB = Number(b);

    if (Number.isNaN(auxA) && Number.isNaN(auxB)) {
      return (a < b ? -1 : 1) * order;
    }

    if (!Number.isNaN(auxA) && Number.isNaN(auxB)) {
      return -1 * order;
    }

    if (Number.isNaN(auxA) && !Number.isNaN(auxB)) {
      return 1 * order;
    }

    if (!Number.isNaN(auxA) && !Number.isNaN(auxB)) {
      return (auxA < auxB ? -1 : 1) * order;
    }
  }
}
