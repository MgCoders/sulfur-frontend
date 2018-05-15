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

@Component({
  selector: 'app-mis-horas',
  templateUrl: './mis-horas.component.html',
  styleUrls: ['./mis-horas.component.scss']
})
export class MisHorasComponent implements OnInit {

  public fDesde: Date;
  public fHasta: Date;
  public lista: Hora[];
  public listaTotales: Array<{proyectoId: number, proyectoNombre: string, minutos: number}>;
  public total: number;
  public colaboradorActual: Colaborador;
  public loading: boolean;

  constructor(private service: HoraService,
              private as: AlertService,
              private datePipe: DatePipe,
              private customDatePipe: CustomDatePipe,
              private decimalPipe: DecimalPipe,
              private timePipe: TimePipe,
              private authService: AuthService,
              private layoutService: LayoutService,
              public dialog: MatDialog) {
}

  ngOnInit() {
    this.colaboradorActual = this.authService.getCurrentUser();
    this.fHasta = new Date();
    this.fDesde = new Date();
    this.listaTotales = new Array();
    this.total = 0;
    this.loading = false;

    this.fDesde.setDate(1);

    this.Reload();
  }

  public Reload() {
    // Hacemos los chequeos.
    if (this.fDesde === undefined) {
      this.as.error('Debe ingresar la fecha "Desde".', 5000);
      return;
    }
    if (this.fHasta === undefined) {
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
          this.listaTotales.push({proyectoId: y.proyecto.id, proyectoNombre: y.proyecto.nombre, minutos: this.timePipe.transform(y.duracion, ['minutos'])});
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

    this.Reload();
  }
}
