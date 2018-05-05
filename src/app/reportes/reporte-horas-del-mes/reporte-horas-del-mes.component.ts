import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  Hora,
  Proyecto,
  TipoTarea,
  HoraDetalle,
  HoraDetalleImp,
  Colaborador,
  Cargo
} from '../../_models/models';
import { HoraImp } from '../../_models/HoraImp';
import { HoraService } from '../../_services/hora.service';
import { AlertService } from '../../_services/alert.service';
import { AuthService } from '../../_services/auth.service';
import { LayoutService } from '../../layout/layout.service';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { CustomDatePipe } from '../../_pipes/customDate.pipe';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA
} from '@angular/material';
import { DialogConfirmComponent } from '../../shared/dialog-confirm/dialog-confirm.component';

import {
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { TimePipe } from '../../_pipes/time.pipe';
import { CargoService } from '../../_services/cargo.service';
import { ColaboradorService } from '../../_services/colaborador.service';
import { ReporteService } from '../../_services/reporte.service';
import { HorasProyectoXCargo } from '../../_models/HorasProyectoXCargo';
import { ProyectoService } from '../../_services/proyecto.service';
import { PapaParseService } from 'ngx-papaparse';
import * as FileSaver from 'file-saver';
import { HorasReporte1 } from '../../_models/HorasProyectoTipoTareaXCargo';
import { CargoImp } from '../../_models/CargoImp';

@Component({
  selector: 'app-reporte-horas-del-mes',
  templateUrl: './reporte-horas-del-mes.component.html',
  styleUrls: ['./reporte-horas-del-mes.component.scss']
})
export class ReporteHorasDelMesComponent implements OnInit {

  public proyectoActual: Proyecto;
  public proyectos: Proyecto[];
  public reporteHoras: HorasProyectoXCargo[];
  public listaTotales: Array<{ cargo: Cargo, cantidadHoras: number, importe: number }>;
  public colaboradores: Colaborador[];
  public listaCargos: Cargo[];
  public listaColaboradoresPorCargo: Array<{ id: number, lista: Array<{ iniciales: string, nombre: string }> }>;
  public totalHoras: number;
  public totalImporte: number;
  public loading: number;
  public lista: HorasReporte1[];
  public fDesde: Date;
  public fHasta: Date;
  public fDesdeFC = new FormControl('', [Validators.required]);
  public fHastaFC = new FormControl('', [Validators.required]);

  constructor(private service: ReporteService,
              private cargoDervice: CargoService,
              private colaboradorService: ColaboradorService,
              private proyectoService: ProyectoService,
              private as: AlertService,
              private datePipe: DatePipe,
              private customDatePipe: CustomDatePipe,
              private decimalPipe: DecimalPipe,
              private timePipe: TimePipe,
              private authService: AuthService,
              private layoutService: LayoutService,
              public dialog: MatDialog,
              private papa: PapaParseService) { }

  ngOnInit() {
    this.loading = 0;
    this.proyectoActual = {} as Proyecto;
    this.listaColaboradoresPorCargo = new Array();
    this.colaboradores = new Array();
    this.fHasta = new Date();
    this.fDesde = new Date();
    this.fDesde.setDate(1);

    this.loading++;
    this.layoutService.updatePreloaderState('active');
    this.cargoDervice.getAll().subscribe(
      (data) => {
        this.loading--;
        data.forEach((c) => {
          this.listaColaboradoresPorCargo.push({ id: c.id, lista: new Array() });
        });

        this.listaCargos = data;
        this.listaCargos.sort((a: Cargo, b: Cargo) => {
          return a.id - b.id;
        });

        // Cargamos los colaboradores.
        this.loading++;
        this.colaboradorService.getAll().subscribe(
          (dataC) => {
            this.loading--;
            this.colaboradores = dataC;
            this.listaCargos.forEach((c) => {
              this.listaColaboradoresPorCargo.find((h) => h.id === c.id).lista = this.GetIniciales(c);
            });

            // En el inicio cargamos el resumen de todos los proyectos.
            this.Load();
          },
          (errorC) => {
            this.loading--;
            this.layoutService.updatePreloaderState('hide');
            this.as.error(errorC, 5000);
          }
        );
      },
      (error) => {
        this.loading--;
        this.layoutService.updatePreloaderState('hide');
        this.as.error(error, 5000);
      });
  }

  Load() {
    // Hacemos los chequeos.
    if (this.fDesde === undefined || this.fDesde === null) {
      this.as.error('Debe ingresar la fecha "Desde".', 5000);
      return;
    }
    if (this.fHasta === undefined || this.fHasta === null) {
      this.as.error('Debe ingresar la fecha "Hasta".', 5000);
      return;
    }
    if (this.fDesde.getTime() > this.fHasta.getTime()) {
      this.as.error('La fecha "Desde" debe ser menor o igual que la fecha "Hasta".', 5000);
      return;
    }

    if (this.proyectoActual === undefined || this.proyectoActual.id === undefined) {
      this.loading++;
      this.layoutService.updatePreloaderState('active');
      this.service.getResumenHoras(this.fDesde, this.fHasta).subscribe(
        (data) => {
          this.lista = data;
          this.loading--;
          this.layoutService.updatePreloaderState('hide');
        },
        (error) => {
          this.loading--;
          this.layoutService.updatePreloaderState('hide');
          this.as.error(error, 5000);
        }
      );
    } else {
      this.loading++;
      this.layoutService.updatePreloaderState('active');
      this.service.getResumenHoras_x_proyecto(this.fDesde, this.fHasta, this.proyectoActual.id).subscribe(
        (data) => {
          this.lista = data;
          this.loading--;
          this.layoutService.updatePreloaderState('hide');
        },
        (error) => {
          this.loading--;
          this.layoutService.updatePreloaderState('hide');
          this.as.error(error, 5000);
        }
      );
    }
  }

  getFilas(horasReporte: HorasReporte1[]) {
    return horasReporte.filter((item) => item.cargo != null && (item.cargo.enabled || item.cantidadHoras > 0 || item.cantidadHorasEstimadas > 0)).sort((a, b) => {
      return new CargoImp(b.cargo).GetPrecioUltimo() - new CargoImp(a.cargo).GetPrecioUltimo();
    });
  }

  getTotal(horasReporte: HorasReporte1[]) {
    return horasReporte.filter((item) => item.cargo == null);
  }

  proyectoSeleccionado(proyecto: Proyecto) {
    this.proyectoActual = proyecto;
    this.Load();
  }

  // TODO Modularizar.
  GetMinutosToString(m: number) {
    const horas = Math.trunc((m) / 60);
    const minutos = (m) - Math.trunc((m) / 60) * 60;
    return horas + ' hs. ' + minutos + ' min.';
  }

  // TODO Modularizar, se repite en el reporte de cargos.
  GetIniciales(c: Cargo): Array<{ iniciales: string, nombre: string }> {
    const result: Array<{ iniciales: string, nombre: string }> = new Array();
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
        result.push({ iniciales: aux.toUpperCase(), nombre: x.nombre });
      });

    return result;
  }

  GetInicialesAux(id: number): Array<{ iniciales: string, nombre: string }> {
    if (this.listaColaboradoresPorCargo === undefined || this.listaColaboradoresPorCargo.length === 0) {
      return new Array();
    }
    return this.listaColaboradoresPorCargo.find((x) => x.id === id).lista;
  }

  public Download_CSV() {
    // Generamos el archivo con el detalle de la comparacion de horas cargadas vs. estimadas.
    const nombre: string = 'Horas_Reales_Resumen_y_Costos_' + (this.proyectoActual.nombre === undefined ? 'TODOS' : this.proyectoActual.nombre.replace(' ', '_')) + '.csv';
    const detalle: Array<{ Cargo: string, Codigo: string, Horas_Cargadas: string, Importe_Total: string }> = new Array();
    this.lista.forEach((x) => {
      if (x.cargo !== undefined) {
        detalle.push({ Cargo: x.cargo.nombre, Codigo: x.cargo.codigo, Horas_Cargadas: x.cantidadHoras.toString().replace('.', ','), Importe_Total: x.precioTotal.toString().replace('.', ',') });
      }
    });
    const blob = new Blob([this.papa.unparse(detalle, {delimiter: ';'})]);
    FileSaver.saveAs(blob, nombre);
  }

  MesAnterior() {
    const newFDesde = new Date();
    const newFHasta = new Date();

    if (this.fDesde.getMonth() === 0) {
      newFDesde.setFullYear(this.fDesde.getFullYear() - 1);
      newFDesde.setMonth(11);
      newFDesde.setDate(1);
    } else {
      newFDesde.setFullYear(this.fDesde.getFullYear());
      newFDesde.setMonth(this.fDesde.getMonth() - 1);
      newFDesde.setDate(1);
    }

    if (this.fHasta.getMonth() === 0) {
      newFHasta.setFullYear(this.fHasta.getFullYear() - 1);
      newFHasta.setMonth(11);
      newFHasta.setDate(new Date(this.fHasta.getFullYear(), this.fHasta.getMonth(), 0).getDate());
    } else {
      newFHasta.setFullYear(this.fHasta.getFullYear());
      newFHasta.setMonth(this.fHasta.getMonth() - 1);
      newFHasta.setDate(new Date(this.fHasta.getFullYear(), this.fHasta.getMonth(), 0).getDate());
    }

    this.fDesde = newFDesde;
    this.fHasta = newFHasta;

    this.Load();
  }
}
