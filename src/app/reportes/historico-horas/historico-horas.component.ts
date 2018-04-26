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
  Colaborador
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
import { PapaParseService } from 'ngx-papaparse';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-historico-horas',
  templateUrl: './historico-horas.component.html',
  styleUrls: ['./historico-horas.component.scss']
})
export class HistoricoHorasComponent implements OnInit {

  public fDesde: Date;
  public fHasta: Date;
  public lista: Hora[];
  public listaTotales: Array<{ proyectoId: number, proyectoNombre: string, minutos: number }>;
  public total: number;
  public colaboradorActual: Colaborador;
  public loading: boolean;
  public fDesdeFC = new FormControl('', [Validators.required]);
  public fHastaFC = new FormControl('', [Validators.required]);

  constructor(private service: HoraService,
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
    this.colaboradorActual = this.authService.getCurrentUser();
    this.fHasta = new Date();
    this.fDesde = this.fHasta;
    this.listaTotales = new Array();
    this.total = 0;
    this.loading = false;

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

    // Cargamos las horas.
    this.layoutService.updatePreloaderState('active');
    this.total = 0;
    this.loading = true;
    this.service.getPorUsuarioYFecha(this.colaboradorActual.id, this.fDesde, this.fHasta).subscribe(
      (data) => {
        this.lista = data;
        this.CalcularSubtotales();
        this.lista.sort((a: Hora, b: Hora) => {
          return this.customDatePipe.transform(b.dia, []).getTime() - this.customDatePipe.transform(a.dia, []).getTime();
        });
        this.layoutService.updatePreloaderState('hide');
        this.loading = false;
      },
      (error) => {
        this.as.error(error, 5000);
        this.layoutService.updatePreloaderState('hide');
        this.loading = false;
      }
    );
  }

  public CalcularSubtotales() {
    this.listaTotales = new Array();
    this.lista.forEach((x) => {
      x.horaDetalleList.forEach((y) => {
        const pId: number = this.listaTotales.findIndex((z) => z.proyectoId === y.proyecto.id);
        if (pId < 0) {
          this.listaTotales.push({ proyectoId: y.proyecto.id, proyectoNombre: y.proyecto.nombre, minutos: this.timePipe.transform(y.duracion, ['minutos']) });
        } else {
          this.listaTotales.find((z) => z.proyectoId === y.proyecto.id).minutos += this.timePipe.transform(y.duracion, ['minutos']);
        }
        this.total += this.timePipe.transform(y.duracion, ['minutos']);
      });
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
    const nombre: string = 'Historico_Horas_Detalle_' + this.colaboradorActual.id.toString() + '_' +
      this.datePipe.transform(this.fDesde, 'yyyyMMdd') + '_' +
      this.datePipe.transform(this.fHasta, 'yyyyMMdd') + '.csv';
    const detalle: Array<{Dia: string, Hora_Entrada: string, Hora_Salida: string, Tiempo_Total: string, Horas_Cargadas: string, Status: string}> = new Array();
    this.lista.forEach((x) => {
        detalle.push({Dia: x.dia, Hora_Entrada: x.horaIn, Hora_Salida: x.horaOut, Tiempo_Total: this.timePipe.transform(x.subtotal, ['HH:mm']), Horas_Cargadas: this.timePipe.transform(x.subtotalDetalles, ['HH:mm']), Status: (x.completa ? 'Ok' : 'Error')});
      });
    const blob = new Blob([this.papa.unparse(detalle)]);
    FileSaver.saveAs(blob, nombre);

    // Generamos el archivo con el resumen del historico de horas.
    const nombre2: string = 'Historico_Horas_Resumen_' + this.colaboradorActual.id.toString() + '_' +
      this.datePipe.transform(this.fDesde, 'yyyyMMdd') + '_' +
      this.datePipe.transform(this.fHasta, 'yyyyMMdd') + '.csv';
    const resumen: Array<{Proyecto: string, Horas: string}> = new Array();
    this.listaTotales.forEach((x) => {
      resumen.push({Proyecto: x.proyectoNombre, Horas: this.GetMinutosToString2(x.minutos)});
    });
    const blob2 = new Blob([this.papa.unparse(resumen)]);
    FileSaver.saveAs(blob2, nombre2);
  }
}
