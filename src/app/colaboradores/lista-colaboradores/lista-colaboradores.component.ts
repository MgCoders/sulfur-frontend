import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { AltaColaboradorComponent } from '../alta-colaborador/alta-colaborador.component';
import { ColaboradorService } from '../../_services/colaborador.service';
import { AlertService } from '../../_services/alert.service';
import { Colaborador } from '../../_models/models';
import { LayoutService } from '../../layout/layout.service';
import { DialogConfirmComponent } from '../../shared/dialog-confirm/dialog-confirm.component';
import { environment } from '../../../environments/environment';
import { CargoImp } from '../../_models/CargoImp';

@Component({
  selector: 'app-lista-colaboradores',
  templateUrl: './lista-colaboradores.component.html',
  styleUrls: ['./lista-colaboradores.component.scss']
})
export class ListaColaboradoresComponent implements OnInit {

  public lista: Colaborador[];
  public showIdColumns: boolean;

  constructor(public dialog: MatDialog,
              private service: ColaboradorService,
              private as: AlertService,
              private layoutService: LayoutService) { }

  ngOnInit() {
    this.lista = new Array();
    this.showIdColumns = environment.showIdColumns;

    this.layoutService.updatePreloaderState('active');
    this.service.getAll().subscribe(
      (data) => {
        this.lista = data;

        this.lista.sort((a: Colaborador, b: Colaborador) => {
          const prioB = b.cargo === undefined ? 0 : new CargoImp(b.cargo).GetPrecioUltimo();
          const prioA = a.cargo === undefined ? 0 : new CargoImp(a.cargo).GetPrecioUltimo();
          return prioB - prioA;
        });
        this.layoutService.updatePreloaderState('hide');
      },
      (error) => {
        this.layoutService.updatePreloaderState('hide');
        this.as.error(error, 5000);
      });
  }

  Nuevo() {
    const dialog = this.dialog.open(AltaColaboradorComponent, {
      data: [undefined, this.lista],
      width: '600px',
    });
  }

  Eliminar(x: Colaborador) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: '¿Está seguro que desea eliminar el colaborador ' + x.nombre + '?',
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          // TODO
          this.as.success('Colaborador eliminado correctamente.', 3000);
        }
      });
  }

  Editar(x: Colaborador) {
    const dialog = this.dialog.open(AltaColaboradorComponent, {
      data: [x, this.lista],
      width: '600px',
    });
  }
}
