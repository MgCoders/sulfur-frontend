import { Component, OnInit } from '@angular/core';
import { EstimacionService } from '../../_services/estimacion.service';
import { CargoService } from '../../_services/cargo.service';
import { TareaService } from '../../_services/tarea.service';
import { AlertService } from '../../_services/alert.service';
import {
  Estimacion,
  EstimacionCargo,
  EstimacionTipoTarea,
  Proyecto,
  Cargo,
  TipoTarea,
  PrecioHora
} from '../../_models/models';
import { LayoutService } from '../../layout/layout.service';
import { ActivatedRoute } from '@angular/router';
import { EstimacionImp } from '../../_models/EstimacionImp';
import { TimePipe } from '../../_pipes/time.pipe';
import {
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CustomDatePipe } from '../../_pipes/customDate.pipe';
import { CargoImp } from '../../_models/CargoImp';

@Component({
  selector: 'app-estimacion-detalle',
  templateUrl: './estimacion-detalle.component.html',
  styleUrls: ['./estimacion-detalle.component.scss']
})
export class EstimacionDetalleComponent implements OnInit {

  public idEstimacionActual: number;
  public estimacionActual: Estimacion;
  public editando: boolean;
  public cargos: Cargo[];
  public tareas: TipoTarea[];
  public estCargo: EstimacionCargo[];
  public tareasCargos: Array<{ idTarea: number, nombreTarea: string, cargos: Array<{ idCargo: number, nombreCargo: string, value: number, FC: FormControl, CostoCargo: number }>, PrioridadTarea: number }>;
  public tareasCargosRespaldo: Array<{ idTarea: number, nombreTarea: string, cargos: Array<{ idCargo: number, nombreCargo: string, value: number, FC: FormControl, CostoCargo: number }>, PrioridadTarea: number }>;
  public horaCargo: Array<{idCargo: number, codigo: string, value: number, FC: FormControl, CostoCargo: number }>;
  public horaCargoRespaldo: Array<{idCargo: number, codigo: string, value: number, FC: FormControl, CostoCargo: number }>;
  public loading: boolean;

  constructor(private service: EstimacionService,
              private serviceC: CargoService,
              private serviceT: TareaService,
              private as: AlertService,
              private route: ActivatedRoute,
              private timePipe: TimePipe,
              private datePipe: CustomDatePipe,
              private layoutService: LayoutService) { }

  ngOnInit() {
    this.editando = false;
    this.estCargo = new Array();
    this.tareasCargos = new Array();
    this.tareasCargosRespaldo = new Array();
    this.horaCargo = new Array();
    this.horaCargoRespaldo = new Array();
    this.loading = false;

    this.route.params.subscribe((params) => {
      this.idEstimacionActual = +params['id'];
      this.layoutService.updatePreloaderState('active');
      this.loading = true;
      this.serviceC.getAll().subscribe(
        (datac) => {
          this.cargos = datac;
          this.serviceT.getAll().subscribe(
            (datat) => {
              this.tareas = datat;
              this.LoadEstimacion();
            },
            (error) => {
              this.as.error(error, 5000);
              this.layoutService.updatePreloaderState('hide');
              this.loading = false;
            });
        },
        (error) => {
          this.as.error(error, 5000);
          this.layoutService.updatePreloaderState('hide');
          this.loading = false;
        });
    });
  }

  LoadEstimacion() {
    this.layoutService.updatePreloaderState('active');
    this.loading = true;
    this.service.get(this.idEstimacionActual).subscribe(
      (data) => {
        this.estimacionActual = data;

        this.estimacionActual.estimacionCargos.forEach((x) => {
          x.estimacionTipoTareas.forEach((y) => {
            if (this.tareasCargos.findIndex((t) => t.idTarea === y.tipoTarea.id) === -1) {
              this.tareasCargos.push({ idTarea: y.tipoTarea.id, nombreTarea: y.tipoTarea.nombre, cargos: new Array(), PrioridadTarea: y.tipoTarea.prioridad });
            }
            this.tareasCargos.find((t) => t.idTarea === y.tipoTarea.id).cargos.push({ idCargo: x.cargo.id, nombreCargo: x.cargo.codigo, value: +this.timePipe.transform(y.duracion, ['HH']), FC: new FormControl('', [Validators.required, Validators.min(0)]), CostoCargo: new CargoImp(x.cargo).GetPrecioUltimo() });
          });
          this.horaCargo.push({idCargo: x.cargo.id, codigo: x.cargo.codigo, value: x.precioTotal, FC: new FormControl('', [Validators.required, Validators.min(0)]), CostoCargo: new CargoImp(x.cargo).GetPrecioUltimo()});
        });

        this.tareasCargos.forEach((x) => {
          x.cargos.sort((a: { idCargo: number, nombreCargo: string, value: number, FC: FormControl, CostoCargo: number }, b: { idCargo: number, nombreCargo: string, value: number, FC: FormControl, CostoCargo: number }) => {
            return b.CostoCargo - a.CostoCargo;
          });
        });
        this.tareasCargos.sort((a: { idTarea: number, nombreTarea: string, cargos: Array<{ idCargo: number, nombreCargo: string, value: number, FC: FormControl, CostoCargo: number }>, PrioridadTarea: number }, b: { idTarea: number, nombreTarea: string, cargos: Array<{ idCargo: number, nombreCargo: string, value: number, FC: FormControl, CostoCargo: number }>, PrioridadTarea: number }) => {
          return b.PrioridadTarea - a.PrioridadTarea;
        });
        this.horaCargo.sort((a: {idCargo: number, codigo: string, value: number, FC: FormControl, CostoCargo: number }, b: {idCargo: number, codigo: string, value: number, FC: FormControl, CostoCargo: number }) => {
          return b.CostoCargo - a.CostoCargo;
        });

        this.layoutService.updatePreloaderState('hide');
        this.loading = false;
      },
      (error) => {
        this.layoutService.updatePreloaderState('hide');
        this.loading = false;
        this.as.error(error, 5000);
      });
  }

  Editar() {
    // Respaldamos la estructura actual.
    this.tareasCargosRespaldo = this.Copy(this.tareasCargos);
    this.horaCargoRespaldo = this.CopyHoraCargo(this.horaCargo);
    // Si hay que agregar tareas o cargos los agregamos.
    this.cargos.filter((x) => x.enabled).forEach((x) => {
      this.tareasCargos.forEach((y) => {
        if (y.cargos.findIndex((c) => c.idCargo === x.id) === -1) {
          y.cargos.push({ idCargo: x.id, nombreCargo: x.codigo, value: 0, FC: new FormControl('', [Validators.required, Validators.min(0)]), CostoCargo: new CargoImp(x).GetPrecioUltimo() });
        }
      });

      if (this.horaCargo.findIndex((c) => c.idCargo === x.id) === -1) {
        this.horaCargo.push({codigo: x.codigo, idCargo: x.id, value: 0, FC: new FormControl('', [Validators.required, Validators.min(0)]), CostoCargo: new CargoImp(x).GetPrecioUltimo() });
      }
    });
    this.tareas.filter((x) => x.enabled).forEach((x) => {
      if (this.tareasCargos.findIndex((y) => y.idTarea === x.id) === -1) {
        this.tareasCargos.push({ idTarea: x.id, nombreTarea: x.nombre, cargos: new Array(), PrioridadTarea: x.prioridad });
        this.cargos.forEach((c) => {
          this.tareasCargos.find((y) => y.idTarea === x.id).cargos.push({ idCargo: c.id, nombreCargo: c.codigo, value: 0, FC: new FormControl('', [Validators.required, Validators.min(0)]), CostoCargo: new CargoImp(c).GetPrecioUltimo() });
        });
      }
    });
    // Marcamos que estamos editando.
    this.editando = true;
  }

  GuardarOnClick() {
    this.tareasCargos.forEach((x) => {
      x.cargos.forEach((y) => {
        if (this.estimacionActual.estimacionCargos.findIndex((c) => c.cargo.id === y.idCargo) === -1) {
          this.estimacionActual.estimacionCargos.push({ cargo: this.cargos.find((p) => p.id === y.idCargo), estimacionTipoTareas: new Array(), precioTotal: 0 });
        }
        if (this.estimacionActual.estimacionCargos.find((c) => c.cargo.id === y.idCargo).estimacionTipoTareas.findIndex((p) => p.tipoTarea.id === x.idTarea) === -1) {
          this.estimacionActual.estimacionCargos.find((c) => c.cargo.id === y.idCargo).estimacionTipoTareas.push({ duracion: 'PT0H0M', tipoTarea: this.tareas.find((p) => p.id === x.idTarea) });
        }

        this.estimacionActual.estimacionCargos.find((c) => c.cargo.id === y.idCargo).estimacionTipoTareas.find((t) => t.tipoTarea.id === x.idTarea).duracion = 'PT' + y.value + 'H0M';
        this.estimacionActual.estimacionCargos.find((c) => c.cargo.id === y.idCargo).precioTotal = this.horaCargo.find((c) => c.idCargo === y.idCargo).value;
      });
    });

    this.layoutService.updatePreloaderState('active');
    this.loading = true;
    this.service.edit(this.estimacionActual).subscribe(
      (data) => {
        this.estimacionActual = data;
        this.layoutService.updatePreloaderState('hide');
        this.loading = false;
        this.editando = false;
        this.as.success('Estimación guardada correctamente', 3000);
      },
      (error) => {
        this.as.error(error, 5000);
        this.layoutService.updatePreloaderState('hide');
        this.loading = false;
      }
    );
  }

  Cancelar() {
    this.tareasCargos = this.Copy(this.tareasCargosRespaldo);
    this.horaCargo = this.CopyHoraCargo(this.horaCargoRespaldo);
    this.editando = false;
  }

  GetTotalTarea(id: number) {
    let result: number = 0;
    this.tareasCargos.find((x) => x.idTarea === id).cargos.forEach((x) => {
      if (x.value !== undefined) {
        result += x.value;
      }
    });
    return result;
  }

  Copy(x: Array<{ idTarea: number, nombreTarea: string, cargos: Array<{ idCargo: number, nombreCargo: string, value: number, FC: FormControl, CostoCargo: number  }>, PrioridadTarea: number }>) {
    const copia: Array<{ idTarea: number, nombreTarea: string, cargos: Array<{ idCargo: number, nombreCargo: string, value: number, FC: FormControl, CostoCargo: number  }>, PrioridadTarea: number }> = new Array();
    x.forEach((r) => {
      const aux = {} as { idTarea: number, nombreTarea: string, cargos: Array<{ idCargo: number, nombreCargo: string, value: number, FC: FormControl, CostoCargo: number  }>, PrioridadTarea: number };
      aux.cargos = new Array();
      r.cargos.forEach((c) => {
        const aux2 = {} as { idCargo: number, nombreCargo: string, value: number, FC: FormControl, CostoCargo: number  };
        aux2.idCargo = c.idCargo;
        aux2.nombreCargo = c.nombreCargo;
        aux2.value = c.value;
        aux2.FC = c.FC;
        aux2.CostoCargo = c.CostoCargo;
        aux.cargos.push(aux2);
      });
      aux.idTarea = r.idTarea;
      aux.nombreTarea = r.nombreTarea;
      aux.PrioridadTarea = r.PrioridadTarea;
      copia.push(aux);
    });

    return copia;
  }

  CopyHoraCargo(x: Array<{idCargo: number, codigo: string, value: number, FC: FormControl, CostoCargo: number}>) {
    const result: Array<{idCargo: number, codigo: string, value: number, FC: FormControl, CostoCargo: number}> = new Array();
    x.forEach((y) => {
      result.push({idCargo: y.idCargo, codigo: y.codigo, value: y.value, FC: y.FC, CostoCargo: y.CostoCargo});
    });

    return result;
  }

  GetTotalHorasEstimacionPorCargo(idCargo: number) {
    let result: number = 0;
    this.tareasCargos.forEach((x) => {
      result += x.cargos.find((y) => y.idCargo === idCargo).value;
    });
    return result;
  }

  GetTotalImporteEstimacionPorCargo(idCargo: number) {
    let result: number = 0;
    this.tareasCargos.forEach((x) => {
      // Si se cargo el valor del cargo para la tarea la sumamos.
      if (x.cargos.find((y) => y.idCargo === idCargo).value !== undefined) {
        result += x.cargos.find((y) => y.idCargo === idCargo).value;
      }
    });
    if (this.horaCargo.find((x) => x.idCargo === idCargo).value === undefined) {
      return 0;
    }
    return result * this.horaCargo.find((x) => x.idCargo === idCargo).value;
  }

  GetTotalHorasEstimacion() {
    let result: number = 0;
    this.tareasCargos.forEach((x) => {
      x.cargos.forEach((y) => {
        result += y.value;
      });
    });
    return result;
  }

  GetTotalImporteEstimacion() {
    let result: number = 0;
    this.horaCargo.forEach((x) => {
      result += this.GetTotalImporteEstimacionPorCargo(x.idCargo);
    });
    return result;
  }

  GetValorHoraCargoFecha(idCargo: number) {
    const cargo: Cargo = this.cargos.find((x) => x.id === idCargo);
    cargo.precioHoraHistoria.sort((a: PrecioHora, b: PrecioHora) => {
      return this.datePipe.transform(b.vigenciaDesde, ['']).getTime() - this.datePipe.transform(a.vigenciaDesde, ['']).getTime();
    });
    const lPrecio: PrecioHora[] = cargo.precioHoraHistoria.filter((x) => this.datePipe.transform(x.vigenciaDesde, ['']) <= this.datePipe.transform(this.estimacionActual.fecha, ['']));
    if (lPrecio.length === 0) {
      return 0;
    } else {
      return lPrecio[0].precioHora;
    }
  }
}
