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
import { SelectHoraHastaComponent } from '../select-hora-hasta/select-hora-hasta.component';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA
} from '@angular/material';
import { EditHoraComponent } from '../edit-hora/edit-hora.component';
import { DialogConfirmComponent } from '../../shared/dialog-confirm/dialog-confirm.component';

import {
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { TimePipe } from '../../_pipes/time.pipe';

@Component({
  selector: 'app-lista-horas',
  templateUrl: './lista-horas.component.html',
  styleUrls: ['./lista-horas.component.scss']
})
export class ListaHorasComponent implements OnInit {

  public listaHoras: Hora[];

  public horaActual: Hora;
  public horaActualCopia: Hora;
  public diaActual: Date;

  public horaDetalleActual: HoraDetalle;
  public proyectoActual: Proyecto;
  public tareaActual: TipoTarea;
  public colaboradorActual: Colaborador;

  public fDesde: Date;

  public hourdiv: number = 4;

  public horasInt: number;
  public minutosInt: number;

  public horasDesdeInt: number;
  public minutosDesdeInt: number;
  public horasHastaInt: number;
  public minutosHastaInt: number;

  public isUserAdmin: boolean;

  public minutosFC = new FormControl('', [Validators.required, Validators.max(59), Validators.min(0)]);
  public horasFC = new FormControl('', [Validators.required, Validators.max(23), Validators.min(0)]);

  public horasDesdeIntFC = new FormControl('', [Validators.required, Validators.max(23), Validators.min(0)]);
  public minutosDesdeIntFC = new FormControl('', [Validators.required, Validators.max(59), Validators.min(0)]);

  public horasHastaIntFC = new FormControl('', [Validators.required, Validators.max(23), Validators.min(0)]);
  public minutosHastaIntFC = new FormControl('', [Validators.required, Validators.max(59), Validators.min(0)]);

  public diaFC = new FormControl('', [Validators.required]);

  public editandoHora: boolean;

  constructor(private service: HoraService,
              private as: AlertService,
              private datePipe: DatePipe,
              private decimalPipe: DecimalPipe,
              private timePipe: TimePipe,
              private authService: AuthService,
              private layoutService: LayoutService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.LimpiarCampos();
    this.isUserAdmin = this.authService.isAuthenticatedAndAdmin();
    this.colaboradorActual = this.authService.getCurrentUser();

    this.fDesde = new Date();
    if (this.fDesde.getMonth() === 0) {
      this.fDesde.setMonth(11);
      this.fDesde.setFullYear(this.fDesde.getFullYear() - 1);
    } else {
      this.fDesde.setMonth(this.fDesde.getMonth() - 1);
    }

    this.LoadHoras(true, true, true);
  }

  private LoadHoras(setHora: boolean, setProyectoTarea: boolean, setHoraInOut: boolean) {
    this.layoutService.updatePreloaderState('active');
    this.service.getPorUsuarioYFecha(this.colaboradorActual.id, this.fDesde, (new Date())).subscribe(
      (data) => {
        this.listaHoras = data;

        // Si existe un dia sin completar y hay que setearlo se busca y se setea.
        if (setHora) {
          const ultimaHoraSinCargar: Hora = this.listaHoras.find((x) => !x.completa);
          if (ultimaHoraSinCargar !== undefined) {
            this.editandoHora = false;
            this.horaActual = ultimaHoraSinCargar;

            this.horasDesdeInt = +this.horaActual.horaIn.split(':')[0];
            this.minutosDesdeInt = +this.horaActual.horaIn.split(':')[1];
            this.horasHastaInt = +this.horaActual.horaOut.split(':')[0];
            this.minutosHastaInt = +this.horaActual.horaOut.split(':')[1];
          }
        }

        this.OrdenarLista();

        if (setProyectoTarea && this.listaHoras.length > 0 && this.listaHoras[0].horaDetalleList.length > 0) {
          this.horaDetalleActual.proyecto = this.listaHoras[0].horaDetalleList[0].proyecto;
          this.proyectoActual = this.listaHoras[0].horaDetalleList[0].proyecto;
          this.horaDetalleActual.tipoTarea = this.listaHoras[0].horaDetalleList[0].tipoTarea;
          this.tareaActual = this.listaHoras[0].horaDetalleList[0].tipoTarea;
        }

        this.layoutService.updatePreloaderState('hide');
      },
      (error) => {
        this.as.error(error, 5000);
        this.layoutService.updatePreloaderState('hide');
      }
    );
  }

  ColaboradorOnChange(c: Colaborador) {
    this.colaboradorActual = c;
    this.listaHoras = new Array();
    this.LimpiarCampos();
    this.LoadHoras(true, true, true);
  }

  LimpiarCampos() {
    this.tareaActual = {} as TipoTarea;
    this.proyectoActual = {} as Proyecto;
    this.horaActual = {} as Hora;
    this.horaDetalleActual = {} as HoraDetalle;
    this.editandoHora = true;
    this.horasInt = 0;
    this.minutosInt = 0;
    this.horasDesdeInt = 0;
    this.minutosDesdeInt = 0;
    this.horasHastaInt = 0;
    this.minutosHastaInt = 0;
    this.diaActual = new Date();
    this.editandoHora = false;
  }

  private OrdenarLista() {
    this.listaHoras.sort((a: Hora, b: Hora) => {
      return this.dateFromString(b.dia).getTime() - this.dateFromString(a.dia).getTime();
    });
  }

  ProyectoOnChange(evt: Proyecto) {
    this.horaDetalleActual.proyecto = evt;
  }

  TareaOnChange(evt: TipoTarea) {
    this.horaDetalleActual.tipoTarea = evt;
  }

  fDesdeOnChange(evt) {
    this.LoadHoras(true, false, false);
  }

  GuardarOnClick() {

    this.horaActual.colaborador = this.colaboradorActual;

    if (this.diaActual.getTime() > (new Date()).getTime()) {
      this.as.error('No se pueden cargar horas de días futuros.', 5000);
      return;
    }

    if (this.horasDesdeInt * 60 + this.minutosDesdeInt - this.horasHastaInt * 60 - this.minutosHastaInt >= 0) {
      this.as.error('La hora de salida debe ser posterior a la hora de entrada.', 5000);
      return;
    }

    this.horaActual.dia = this.datePipe.transform(this.diaActual, 'dd-MM-yyyy');
    this.horaActual.horaIn = (this.horasDesdeInt < 10 ? '0' + this.horasDesdeInt : this.horasDesdeInt)  + ':' +
                             (this.minutosDesdeInt < 10 ? '0' + this.minutosDesdeInt : this.minutosDesdeInt);
    this.horaActual.horaOut = (this.horasHastaInt < 10 ? '0' + this.horasHastaInt : this.horasHastaInt) + ':' +
                              (this.minutosHastaInt < 10 ? '0' + this.minutosHastaInt : this.minutosHastaInt);

    this.layoutService.updatePreloaderState('active');
    if (this.horaActual.id === undefined) {
      this.service.create(this.horaActual).subscribe(
        (data) => {
          this.as.success('Registro agregado correctamente.', 3000);
          this.horaActual = data;
          this.LoadHoras(false, false, false);
          this.editandoHora = false;
        },
        (error) => {
          this.as.error(error, 5000);
          this.layoutService.updatePreloaderState('hide');
        });
    } else {
      this.service.edit(this.horaActual).subscribe(
        (data) => {
          this.as.success('Registro actualizado correctamente.', 3000);
          this.horaActual = data;
          this.LoadHoras(false, false, false);
          if (data.completa) {
            this.Nuevo();
          }
          this.editandoHora = false;
        },
        (error) => {
          this.as.error(error, 5000);
          this.layoutService.updatePreloaderState('hide');
        });
    }
  }

  AgregarOnClick() {
    const aux: Hora = new HoraImp(this.horaActual);

    // Si se carga con los inputs
    if (this.horasInt !== undefined && this.minutosInt !== undefined) {
      this.horaDetalleActual.duracion = this.decimalPipe.transform(this.horasInt, '2.0-0') + ':' + this.decimalPipe.transform(this.minutosInt, '2.0-0');
    }

    const aux2: HoraDetalle = new HoraDetalleImp(this.horaDetalleActual);
    aux2.duracion = 'PT' + aux2.duracion.split(':')[0] + 'H' + aux2.duracion.split(':')[1] + 'M';
    aux.horaDetalleList.push(aux2);

    this.layoutService.updatePreloaderState('active');
    this.service.edit(aux).subscribe(
      (data) => {
        this.as.success('Registro agregado correctamente.', 3000);
        const index: number = this.listaHoras.indexOf(this.horaActual);
        this.listaHoras[index] = new HoraImp(data);
        this.horaActual = data;
        this.horaDetalleActual = {} as HoraDetalle;
        this.proyectoActual = {} as Proyecto;
        this.tareaActual = {} as TipoTarea;
        this.horasInt = 0;
        this.minutosInt = 0;
        this.horasFC.markAsUntouched();
        this.minutosFC.markAsUntouched();
        this.LoadHoras(false, false, false);
        if (data.completa) {
          this.Nuevo();
          this.editandoHora = false;
        }
      },
      (error) => {
        this.as.error(error, 5000);
        this.layoutService.updatePreloaderState('hide');
      });
  }

  dateFromString(str: string): Date {
    const aux: string[] = str.split('-');
    return new Date(+aux[2], +aux[1] - 1, +aux[0]);
  }

  Editar(x: Hora) {
    this.horaActual = new HoraImp(x);
    this.diaActual = this.dateFromString(this.horaActual.dia);
    this.horasDesdeInt = +this.horaActual.horaIn.split(':')[0];
    this.minutosDesdeInt = +this.horaActual.horaIn.split(':')[1];
    this.horasHastaInt = +this.horaActual.horaOut.split(':')[0];
    this.minutosHastaInt = +this.horaActual.horaOut.split(':')[1];

    this.horaDetalleActual = {} as HoraDetalle;
    this.horasInt = 0;
    this.minutosInt = 0;
    this.tareaActual = {} as TipoTarea;
    this.proyectoActual = {} as Proyecto;
    this.editandoHora = false;
  }

  Eliminar(x: Hora) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: '¿Está seguro que desea eliminar la hora del día ' + x.dia + '?',
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.layoutService.updatePreloaderState('active');
          this.service.delete(x).subscribe(
            (data) => {
              this.as.success('Hora eliminada correctamente.', 5000);
              this.layoutService.updatePreloaderState('hide');
              this.LoadHoras(true, true, true);
            },
            (error) => {
              this.layoutService.updatePreloaderState('hide');
              this.as.error(error, 5000);
            }
          );
        }
      });
  }

  EliminarTiempo(x: HoraDetalle) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: '¿Está seguro que desea eliminar el registro de tiempo?',
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          const aux: Hora = new HoraImp(this.horaActual);
          aux.horaDetalleList.splice(aux.horaDetalleList.indexOf(x), 1);
          this.service.edit(aux).subscribe(
            (data) => {
              this.as.success('Registro eliminado correctamente.', 3000);
              const index: number = this.listaHoras.indexOf(this.horaActual);
              this.listaHoras[index] = data;
              this.horaActual = data;
              this.LoadHoras(false, false, false);
              this.layoutService.updatePreloaderState('hide');
            },
            (error) => {
              this.as.error(error, 5000);
              this.layoutService.updatePreloaderState('hide');
            });
        }
      });
  }

  Nuevo() {
    this.horaActual = {} as Hora;
    this.diaActual = new Date();
    this.editandoHora = true;
    this.horaActual.horaIn = this.GetHoraActualStr(this.diaActual);
    this.horaActual.horaOut = this.horaActual.horaIn;
    this.horasDesdeInt = this.diaActual.getHours();
    this.minutosDesdeInt = this.diaActual.getMinutes();
    this.horasHastaInt = this.diaActual.getHours();
    this.minutosHastaInt = this.diaActual.getMinutes();

    if (this.listaHoras.length > 0) {
      this.horaActual.horaIn = this.listaHoras[0].horaIn;
      this.horaActual.horaOut = this.listaHoras[0].horaOut;

      this.horasDesdeInt = +this.horaActual.horaIn.split(':')[0];
      this.minutosDesdeInt = +this.horaActual.horaIn.split(':')[1];
      this.horasHastaInt = +this.horaActual.horaOut.split(':')[0];
      this.minutosHastaInt = +this.horaActual.horaOut.split(':')[1];
    }
    this.horaDetalleActual = {} as HoraDetalle;
    this.proyectoActual = {} as Proyecto;
    this.tareaActual = {} as TipoTarea;
    this.horasInt = 0;
    this.minutosInt = 0;

    this.horasFC.markAsUntouched();
    this.minutosFC.markAsUntouched();
    this.horasDesdeIntFC.markAsUntouched();
    this.minutosDesdeIntFC.markAsUntouched();
    this.horasHastaIntFC.markAsUntouched();
    this.minutosHastaIntFC.markAsUntouched();
  }

  GetHoraActualStr(ahora: Date) {
    let minutos: number = (Math.round(ahora.getMinutes() / (60 / this.hourdiv)) * (60 / this.hourdiv));
    const hotasInt: number = minutos === 60 ? ahora.getHours() + 1 :  ahora.getHours();
    const horas: string = hotasInt.toString().length === 1 ? '0' + hotasInt.toString() : hotasInt.toString();
    if (minutos === 60) {
      minutos = 0;
    }
    const minutosStr: string = minutos.toString().length === 1 ? '0' + minutos.toString() : minutos.toString();
    return horas + ':' + minutosStr;
  }

  horasOnClick() {
    if (this.horasInt === undefined) {
      this.horasInt = 0;
      return;
    }

    if (this.horasInt + 5 > 24) {
      return;
    }

    this.horasInt += 5;
  }

  minutosOnClick() {
    if (this.minutosInt === undefined) {
      this.minutosInt = 0;
      return;
    }

    if (this.minutosInt + 15 > 59) {
      return;
    }

    this.minutosInt += 15;
  }

  horasDesdeIntOnClick() {
    if (this.horasDesdeInt === undefined) {
      this.horasDesdeInt = 0;
      return;
    }

    if (this.horasDesdeInt + 5 > 24) {
      return;
    }

    this.horasDesdeInt += 5;
  }

  minutosDesdeIntOnClick() {
    if (this.minutosDesdeInt === undefined) {
      this.minutosDesdeInt = 0;
      return;
    }

    if (this.minutosDesdeInt + 15 > 59) {
      return;
    }

    this.minutosDesdeInt += 15;
  }

  horasHastaIntOnClick() {
    if (this.horasHastaInt === undefined) {
      this.horasHastaInt = 0;
      return;
    }

    if (this.horasHastaInt + 5 > 24) {
      return;
    }

    this.horasHastaInt += 5;
  }

  minutosHastaIntOnClick() {
    if (this.minutosHastaInt === undefined) {
      this.minutosHastaInt = 0;
      return;
    }

    if (this.minutosHastaInt + 15 > 59) {
      return;
    }

    this.minutosHastaInt += 15;
  }

  GetTotalCargado() {
    let minutosTotalesCargados: number = 0;
    this.horaActual.horaDetalleList.forEach((x) => {
      minutosTotalesCargados += this.timePipe.transform(x.duracion, ['minutos']);
    });

    const horas = Math.trunc((minutosTotalesCargados) / 60);
    const minutos = (minutosTotalesCargados) - Math.trunc((minutosTotalesCargados) / 60) * 60;
    return horas + ' hs. ' + minutos + ' min.';
  }

  GetSaldo() {
    let minutosTotalesCargados: number = 0;
    this.horaActual.horaDetalleList.forEach((x) => {
      minutosTotalesCargados += this.timePipe.transform(x.duracion, ['minutos']);
    });

    const saldo: number = this.timePipe.transform(this.horaActual.subtotal, ['minutos']) - minutosTotalesCargados;

    const horas = Math.trunc((saldo) / 60);
    const minutos = (saldo) - Math.trunc((saldo) / 60) * 60;
    return horas + ' hs. ' + minutos + ' min.';
  }

  Cancelar() {
    this.editandoHora = false;
  }

  EditarHora() {
    this.editandoHora = true;
  }
}
