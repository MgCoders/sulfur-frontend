import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { AltaCargoComponent } from '../alta-cargo/alta-cargo.component';
import { HistoricoPrecioCargoComponent } from '../historico-precio-cargo/historico-precio-cargo.component';
import { CargoService } from '../../_services/cargo.service';
import { ColaboradorService } from '../../_services/colaborador.service';
import { AlertService } from '../../_services/alert.service';
import { Cargo, PrecioHora, Colaborador } from '../../_models/models';
import { LayoutService } from '../../layout/layout.service';
import { DialogConfirmComponent } from '../../shared/dialog-confirm/dialog-confirm.component';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { CustomDatePipe } from '../../_pipes/customDate.pipe';
import { environment } from '../../../environments/environment';
import { CargoImp } from '../../_models/CargoImp';

@Component({
  selector: 'app-lista-cargos',
  templateUrl: './lista-cargos.component.html',
  styleUrls: ['./lista-cargos.component.scss']
})
export class ListaCargosComponent implements OnInit {

  public lista: Cargo[];
  public colaboradores: Colaborador[];
  public listaColaboradoresPorCargo: Array<{id: number, lista: Array<{iniciales: string, nombre: string}>}>;
  public loading: number = 0;
  public showIdColumns: boolean;

  constructor(public dialog: MatDialog,
              private service: CargoService,
              private colaboradorService: ColaboradorService,
              private as: AlertService,
              private layoutService: LayoutService,
              private router: Router,
              private datePipe: CustomDatePipe) { }

  ngOnInit() {
    this.lista = new Array();
    this.listaColaboradoresPorCargo = new Array();
    this.showIdColumns = environment.showIdColumns;

    this.layoutService.updatePreloaderState('active');
    this.service.getAll().subscribe(
      (data) => {
        data.forEach((c) => {
          this.listaColaboradoresPorCargo.push({id: c.id, lista: new Array()});
        });

        this.lista = data;
        this.lista.sort((a: Cargo, b: Cargo) => {
          return new CargoImp(b).ultimoPrecio - new CargoImp(a).ultimoPrecio;
        });

        // Cargamos los colaboradores.
        this.colaboradorService.getAll().subscribe(
          (dataC) => {
            this.colaboradores = dataC;
            this.lista.forEach((c) => {
              this.listaColaboradoresPorCargo.find((h) => h.id === c.id).lista = this.GetIniciales(c);
            });

            this.layoutService.updatePreloaderState('hide');
          },
          (errorC) => {
            this.layoutService.updatePreloaderState('hide');
            this.as.error(errorC, 5000);
          }
        );
      },
      (error) => {
        this.layoutService.updatePreloaderState('hide');
        this.as.error(error, 5000);
      });
  }

  Nuevo() {
    const dialog = this.dialog.open(AltaCargoComponent, {
      data: [undefined, this.lista],
      width: '600px',
    });
  }

  Eliminar(x: Cargo) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: '¿Está seguro que desea eliminar el cargo ' + x.nombre + '?',
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          // TODO
          this.as.success('Cargo eliminado correctamente.', 3000);
        }
    });
  }

  Editar(x: Cargo) {
    const dialog = this.dialog.open(AltaCargoComponent, {
      data: [x, this.lista],
      width: '600px',
    });
  }

  GetUltimoPrecio(c: Cargo) {
    if (c.precioHoraHistoria === undefined || c.precioHoraHistoria.length === 0) {
      return 0;
    } else {
      return c.precioHoraHistoria.sort((a: PrecioHora, b: PrecioHora) => {
        return this.datePipe.transform(b.vigenciaDesde, []).getTime() - this.datePipe.transform(a.vigenciaDesde, []).getTime();
      })[0].precioHora;
    }
  }

  GetFechaUltimoPrecio(c: Cargo) {
    if (c.precioHoraHistoria === undefined || c.precioHoraHistoria.length === 0) {
      return 0;
    } else {
      return c.precioHoraHistoria.sort((a: PrecioHora, b: PrecioHora) => {
        return this.datePipe.transform(b.vigenciaDesde, []).getTime() - this.datePipe.transform(a.vigenciaDesde, []).getTime();
      })[0].vigenciaDesde;
    }
  }

  GetIniciales(c: Cargo): Array<{iniciales: string, nombre: string}> {
    const result: Array<{iniciales: string, nombre: string}> = new Array();
    if (this.colaboradores === undefined) {
      return result;
    }

    this.colaboradores
      .filter((x) => x.cargo != null && x.cargo.id === c.id)
      .forEach((x) => {
        const ini: string[] = x.nombre.split(' ');
        let aux: string = '';
        ini.forEach((y) => {
          if (y.length > 0) {
            aux += y[0];
          }
        });
        result.push({iniciales: aux.toUpperCase(), nombre: x.nombre});
      });

    return result;
  }

  GetInicialesAux(id: number): Array<{iniciales: string, nombre: string}> {
    if (this.listaColaboradoresPorCargo === undefined) {
      return new Array();
    }

    if (this.listaColaboradoresPorCargo.find((x) => x.id === id) === undefined) {
      return new Array();
    } else {
      return this.listaColaboradoresPorCargo.find((x) => x.id === id).lista;
    }
  }
}
