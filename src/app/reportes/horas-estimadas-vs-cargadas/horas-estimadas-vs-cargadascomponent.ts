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
                private cargoService: CargoService) {
    }

    ngOnInit(): void {

        this.CallService();
        this.tareaActual = {} as TipoTarea;
        this.proyectoActual = {} as Proyecto;
        this.tareaService.getAll().subscribe(
            (data) => {
                this.tareas = data;
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
                        this.horasPTXC.push({ tarea, horas });
                        this.horasPTXC.sort((a: { tarea, horas }, b: { tarea, horas }) => {
                            return a.tarea.id - b.tarea.id;
                        });
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
        return horasReporte.filter((item) => item.cargo != null);
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
}