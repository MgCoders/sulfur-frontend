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
  Validators,
} from '@angular/forms';

import { TimePipe } from '../../_pipes/time.pipe';
import { PapaParseService } from 'ngx-papaparse';
import * as FileSaver from 'file-saver';
import { HorasReporte2 } from '../../_models/HorasColaboradorXCargo';
import { ReporteService } from '../../_services/reporte.service';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { HorasReporte1 } from '../../_models/HorasProyectoTipoTareaXCargo';
import { CargoImp } from '../../_models/CargoImp';
import { CargoService } from '../../_services/cargo.service';

@Component({
  selector: 'app-resumen-estudio',
  templateUrl: './resumen-estudio.component.html',
  styleUrls: ['./resumen-estudio.component.scss']
})
export class ResumenEstudioComponent implements OnInit {

  public fDesde: Date;
  public fHasta: Date;
  public cargos: Cargo[];
  public porColaborador: HorasReporte2[];
  public porColaboradorTotales: HorasReporte2[];
  public lista: HorasReporte1[];
  public listaTabla: Array<{proyecto: Proyecto, porCargo: Array<{cargo: Cargo, horas: number}>, totalHoras: number, totalImporte: number}>;
  public listaTablaTotales: Array<{proyecto: Proyecto, porCargo: Array<{cargo: Cargo, horas: number}>, totalHoras: number, totalImporte: number}>;
  public loading: boolean;
  public fDesdeFC = new FormControl('', [Validators.required]);
  public fHastaFC = new FormControl('', [Validators.required]);
  public cantCols: number;
  public cargosHeader: Cargo[];

  constructor(private service: HoraService,
              private cargoService: CargoService,
              private reportService: ReporteService,
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
    this.fHasta = new Date();
    this.fDesde = this.fHasta;
    this.porColaborador = new Array();
    this.porColaboradorTotales = new Array();
    this.lista = new Array();
    this.listaTabla = new Array();
    this.listaTablaTotales = new Array();
    this.cargos = new Array();
    this.cargosHeader = new Array();
    this.loading = false;
    this.cantCols = 3;

    this.fDesde = new Date();
    if (this.fDesde.getMonth() === 0) {
      this.fDesde.setMonth(11);
      this.fDesde.setFullYear(this.fDesde.getFullYear() - 1);
    } else {
      this.fDesde.setMonth(this.fDesde.getMonth() - 1);
    }

    this.Reload();
  }

  public Reload() {
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

    // Cargamos el resumen agrupado por colaborador.
    this.layoutService.updatePreloaderState('active');
    this.loading = true;
    this.reportService.getResumenHoras_x_colaborador(this.fDesde, this.fHasta).subscribe(
      (data) => {
        this.porColaborador = data.filter((x) => x.colaborador !== undefined);
        this.porColaboradorTotales = data.filter((x) => x.colaborador === undefined);

        // Cargamos el resumen de horas por proyecto y cargo.
        this.reportService.getResumenHoras_x_Cargo_Proyecto(this.fDesde, this.fHasta).subscribe(
          (dataC) => {
            this.lista = dataC;

            this.cargoService.getAll().subscribe(
              (dataCargo) => {
                this.cargos = dataCargo;
                this.cargos.sort((x, y) => {
                  return new CargoImp(y).ultimoPrecio - new CargoImp(x).ultimoPrecio;
                });
                this.cantCols = 3 + this.cargos.length;

                // Luego de tener toda la informacion cargada generamos la tabla.
                this.lista.filter((x) => x.cargo !== undefined && x.proyecto !== undefined).forEach((x) => {
                  const indice: number = this.listaTabla.findIndex((y) => y.proyecto.id === x.proyecto.id);
                  if (indice === -1) {
                    const linea = {} as {proyecto: Proyecto, porCargo: Array<{cargo: Cargo, horas: number}>, totalHoras: number, totalImporte: number};
                    linea.totalHoras = 0;
                    linea.totalImporte = 0;
                    linea.proyecto = x.proyecto;
                    linea.porCargo = new Array();
                    this.cargos.forEach((c) => {
                      linea.porCargo.push({cargo: c, horas: 0});
                    });
                    linea.porCargo.sort((h, j) => {
                      return new CargoImp(j.cargo).ultimoPrecio - new CargoImp(h.cargo).ultimoPrecio;
                    });
                    linea.porCargo.find((c) => c.cargo.id === x.cargo.id).horas = x.cantidadHoras;
                    linea.totalHoras += x.cantidadHoras;
                    linea.totalImporte += x.precioTotal;
                    this.listaTabla.push(linea);
                  } else {
                    this.listaTabla[indice].porCargo.find((c) => c.cargo.id === x.cargo.id).horas = x.cantidadHoras;
                    this.listaTabla[indice].totalHoras += x.cantidadHoras;
                    this.listaTabla[indice].totalImporte += x.precioTotal;
                  }
                });
                this.listaTabla.sort((x, y) => {
                  return y.proyecto.prioridad - x.proyecto.prioridad;
                });

                // La linea de totales.
                const linea2 = {} as {proyecto: Proyecto, porCargo: Array<{cargo: Cargo, horas: number}>, totalHoras: number, totalImporte: number};
                linea2.totalHoras = 0;
                linea2.totalImporte = 0;
                linea2.proyecto = undefined;
                linea2.porCargo = new Array();
                this.cargos.forEach((c) => {
                  linea2.porCargo.push({cargo: c, horas: 0});
                });
                linea2.porCargo.sort((h, j) => {
                  return new CargoImp(j.cargo).ultimoPrecio - new CargoImp(h.cargo).ultimoPrecio;
                });
                this.lista.filter((x) => x.cargo !== undefined && x.proyecto === undefined).forEach((x) => {
                  linea2.porCargo.find((t) => t.cargo.id === x.cargo.id).horas += x.cantidadHoras;
                });
                linea2.totalHoras = this.lista.find((x) => x.cargo === undefined && x.proyecto === undefined).cantidadHoras;
                linea2.totalImporte = this.lista.find((x) => x.cargo === undefined && x.proyecto === undefined).precioTotal;
                this.listaTablaTotales.push(linea2);

                // Limpiamos las columnas de cargos que no tengan horas y no esten enable.
                this.cargos.forEach((x) => {
                  if (!x.enabled && this.listaTablaTotales[0].porCargo.find((y) => y.cargo.id === x.id).horas <= 0) {
                    this.listaTabla.forEach((p) => {
                      p.porCargo = p.porCargo.filter((c) => c.cargo.id !== x.id);
                    });
                    this.listaTablaTotales.forEach((p) => {
                      p.porCargo = p.porCargo.filter((c) => c.cargo.id !== x.id);
                    });
                  } else {
                    this.cargosHeader.push(x);
                  }
                });

                this.layoutService.updatePreloaderState('hide');
                this.loading = false;
              },
              (errorCargo) => {
                this.as.error(errorCargo, 5000);
                this.layoutService.updatePreloaderState('hide');
                this.loading = false;
              });
          },
          (errorC) => {
            this.as.error(errorC, 5000);
            this.layoutService.updatePreloaderState('hide');
            this.loading = false;
          });
      },
      (error) => {
        this.as.error(error, 5000);
        this.layoutService.updatePreloaderState('hide');
        this.loading = false;
      });
  }

  GetMinutosToString(m: number) {
    const horas = Math.trunc((m) / 60);
    const minutos = (m) - Math.trunc((m) / 60) * 60;
    return horas + ' hs. ' + minutos + ' min.';
  }

  GetMinutosToString2(m: number) {
    const horas = Math.trunc((m) / 60);
    const minutos = (m) - Math.trunc((m) / 60) * 60;
    return horas + 'H:' + minutos + 'M';
  }

  ColaboradorOnChange(evt: Colaborador) {
    this.Reload();
  }

  public Download_CSV() {
    // Generamos el archivo con el detalle del historico de horas.
    const nombre: string = 'Resumen_Estudio_Por_Colaborador_' +
      this.datePipe.transform(this.fDesde, 'yyyyMMdd') + '_' +
      this.datePipe.transform(this.fHasta, 'yyyyMMdd') + '.csv';
    const detalle: Array<{NombreColaborador: string, Cargo: string, Horas: number, Importe: number}> = new Array();
    this.porColaborador.forEach((x) => {
        detalle.push({NombreColaborador: x.colaborador.nombre, Cargo: x.cargo.codigo, Horas: x.cantidadHoras, Importe: x.precioTotal});
      });
    const blob = new Blob([this.papa.unparse(detalle)]);
    FileSaver.saveAs(blob, nombre);

    // Generamos el archivo con el resumen del historico de horas.
    const nombre2: string = 'Resumen_Estudio_Por_Proyecto_' +
      this.datePipe.transform(this.fDesde, 'yyyyMMdd') + '_' +
      this.datePipe.transform(this.fHasta, 'yyyyMMdd') + '.csv';
    const resumen: Array<{}> = new Array();
    this.listaTabla.forEach((x) => {
      const aux = {};
      aux['Proyecto'] = x.proyecto.nombre;
      x.porCargo.forEach((c) => {
        aux[c.cargo.codigo] = c.horas;
      });
      aux['TotalHorasProyecto'] = x.totalHoras;
      aux['TotalImporteProyecto'] = x.totalImporte;
      resumen.push(aux);
    });
    const blob2 = new Blob([this.papa.unparse(resumen)]);
    FileSaver.saveAs(blob2, nombre2);
  }
}
