import {
    Component,
    OnInit
} from '@angular/core';
import { AlertService } from '../../_services/alert.service';
import { ReporteService } from '../../_services/reporte.service';
import { ProyectoService } from '../../_services/proyecto.service';
import { TareaService } from '../../_services/tarea.service';
import { AuthService } from '../../_services/auth.service';
import { Proyecto } from '../../_models/Proyecto';
import { TipoTarea } from '../../_models/TipoTarea';
import { LayoutService } from '../../layout/layout.service';
import { HorasReporte1 } from '../../_models/HorasProyectoTipoTareaXCargo';
import { CargoService } from '../../_services/cargo.service';
import { PapaParseService } from 'ngx-papaparse';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-horas-estimadas-vs-cargadas',
    styleUrls: ['./horas-estimadas-vs-cargadas.component.scss'],
    templateUrl: './horas-estimadas-vs-cargadas.component.html'
})

export class HorasEstimadasVsCargadasComponent implements OnInit {

    public proyectoActual: Proyecto;
    public tareaActual: TipoTarea;
    public horasPTXC: Array<{ tarea: TipoTarea, horas: HorasReporte1[] }> = [];
    public totales: HorasReporte1[];
    public tareas: TipoTarea[];
    public proyectos: Proyecto[];
    public loading: number = 0;

    constructor(private reporteService: ReporteService,
                private alertService: AlertService,
                private proyectoService: ProyectoService,
                private tareaService: TareaService,
                private authService: AuthService,
                private layoutService: LayoutService,
                private cargoService: CargoService,
                private papa: PapaParseService) {
    }

    ngOnInit(): void {

        this.CallService();
        this.tareaActual = {} as TipoTarea;
        this.proyectoActual = {} as Proyecto;
        this.tareaService.getAll().subscribe(
            (data) => {
                this.tareas = data.sort((a: TipoTarea, b: TipoTarea) => {
                    return b.prioridad - a.prioridad;
                  });
                this.EndService();
            },
            (error) => {
                this.alertService.error(error, 5000);
                this.EndService();
            });

        this.CallService();
        this.proyectoService.getAll().subscribe(
            (dataP) => {
                this.proyectos = dataP;
                this.EndService();
            },
            (errorP) => {
                this.alertService.error(errorP, 5000);
                this.EndService();
            });
    }

    proyectoSeleccionado(proyecto: Proyecto) {
        this.proyectoActual = proyecto;
        this.proyectoOTareaSeleccionados();
    }

    tareaSeleccionada(tarea: TipoTarea) {
        this.tareaActual = tarea;
        this.proyectoOTareaSeleccionados();
    }

    proyectoOTareaSeleccionados() {
        this.horasPTXC = [];
        this.totales = null;

        if (this.proyectoActual.id && this.tareaActual.id) {

            const tarea = this.tareaActual;
            this.CallService();
            this.reporteService.getReporte1(this.proyectoActual, this.tareaActual).subscribe(
                (horas) => {
                    this.horasPTXC.push({ tarea, horas });
                    this.EndService();
                },
                (error) => {
                    this.alertService.error(error, 5000);
                    this.EndService();
                });

            this.CallService();
            this.reporteService.getReporte1Totales(this.proyectoActual).subscribe(
                (horas) => {
                    this.totales = horas;
                    this.EndService();
                },
                (error) => {
                    this.alertService.error(error, 5000);
                    this.EndService();
                });

        } else if (this.proyectoActual.id) {

            this.tareas.forEach((tarea) => {
                this.CallService();
                this.reporteService.getReporte1(this.proyectoActual, tarea).subscribe(
                    (horas) => {
                        if (this.getTotal(horas)[0].cantidadHoras > 0 || this.getTotal(horas)[0].cantidadHorasEstimadas > 0) {
                            this.horasPTXC.push({ tarea, horas });
                            this.horasPTXC.sort((a: { tarea, horas }, b: { tarea, horas }) => {
                                return b.tarea.prioridad - a.tarea.prioridad;
                            });
                        }

                        this.EndService();
                    },
                    (error) => {
                        this.alertService.error(error, 5000);
                        this.EndService();
                    });
            });

            this.CallService();
            this.reporteService.getReporte1Totales(this.proyectoActual).subscribe(
                (horas) => {
                    this.totales = horas;
                    this.EndService();
                },
                (error) => {
                    this.alertService.error(error, 5000);
                    this.EndService();
            });
        }
    }

    getFilas(horasReporte: HorasReporte1[]) {
        return horasReporte.filter((item) => item.cargo != null && (item.cargo.enabled || item.cantidadHoras > 0 || item.cantidadHorasEstimadas > 0));
    }

    getTotal(horasReporte: HorasReporte1[]) {
        return horasReporte.filter((item) => item.cargo == null);
    }

    CallService() {
        this.loading ++;
        this.layoutService.updatePreloaderState('active');
    }

    EndService() {
        this.loading --;
        if (this.loading === 0) {
            this.layoutService.updatePreloaderState('hide');
        }
    }

    public Download_CSV() {
        // Generamos el archivo con el detalle de la comparacion de horas cargadas vs. estimadas.
        const nombre: string = 'Estimadas_Vs_Reales_Detalle_' + this.proyectoActual.nombre.replace(' ', '_') + '.csv';
        const detalle: Array<{Tarea: string, Cargo: string, Horas_Estimadas: number, Horas_Cargadas: number}> = new Array();
        this.horasPTXC.forEach((x) => {
            this.getFilas(x.horas).forEach((y) => {
                detalle.push({Tarea: x.tarea.nombre, Cargo: y.cargo.nombre, Horas_Estimadas: y.cantidadHorasEstimadas, Horas_Cargadas: y.cantidadHoras});
            });
        });
        const blob = new Blob([this.papa.unparse(detalle)]);
        FileSaver.saveAs(blob, nombre);

        // Generamos el archivo con el resumen de la comparacion de horas cargadas vs. estimadas.
        const nombre2: string = 'Estimadas_Vs_Reale_Resumen_' + this.proyectoActual.nombre.replace(' ', '_') + '.csv';
        const resumen: Array<{Cargo: string, Horas_Estimadas: number, Costo_Estimado: number, Horas_Cargadas: number, Costo_Real: number}> = new Array();
        this.getFilas(this.totales).forEach((x) => {
            resumen.push({Cargo: x.cargo.nombre, Horas_Estimadas: x.cantidadHorasEstimadas, Costo_Estimado: x.precioEstimado, Horas_Cargadas: x.cantidadHoras, Costo_Real: x.precioTotal});
        });
        const blob2 = new Blob([this.papa.unparse(resumen)]);
        FileSaver.saveAs(blob2, nombre2);
    }
}
