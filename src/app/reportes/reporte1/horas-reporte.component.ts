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
    selector: 'horas-reporte',
    styles: [],
    templateUrl: './horas-reporte.component.html'
})

export class HorasReporteComponent implements OnInit {

    public proyectoActual: Proyecto;
    public tareaActual: TipoTarea;
    public horasPTXC: Array<{ tarea: TipoTarea, horas: HorasReporte1[] }> = [];
    public totales: HorasReporte1[];
    public tareas: TipoTarea[];
    public proyectos: Proyecto[];

    constructor(private reporteService: ReporteService,
                private alertService: AlertService,
                private proyectoService: ProyectoService,
                private tareaService: TareaService,
                private authService: AuthService,
                private layoutService: LayoutService,
                private cargoService: CargoService) {
    }

    ngOnInit(): void {
        this.layoutService.updatePreloaderState('active');
        this.tareaActual = {} as TipoTarea;
        this.proyectoActual = {} as Proyecto;
        this.tareaService.getAll().subscribe(
            (data) => this.tareas = data,
            (error) => this.alertService.error(error, 5000));
        this.proyectoService.getAll().subscribe(
            (data) => this.proyectos = data,
            (error) => this.alertService.error(error, 5000));
        this.layoutService.updatePreloaderState('hide');
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
        this.layoutService.updatePreloaderState('active');
        this.horasPTXC = [];
        this.totales = null;

        if (this.proyectoActual.id && this.tareaActual.id) {

            const tarea = this.tareaActual;
            this.reporteService.getReporte1(this.proyectoActual, this.tareaActual).subscribe(
                (horas) => this.horasPTXC.push({ tarea, horas }),
                (error) => this.alertService.error(error, 5000));
            this.reporteService.getReporte1Totales(this.proyectoActual).subscribe(
                (horas) => this.totales = horas,
                (error) => this.alertService.error(error, 5000));

        } else if (this.proyectoActual.id) {

            this.tareas.forEach((tarea) => {
                this.reporteService.getReporte1(this.proyectoActual, tarea).subscribe(
                    (horas) => this.horasPTXC.push({ tarea, horas }),
                    (error) => this.alertService.error(error, 5000));
            });
            this.reporteService.getReporte1Totales(this.proyectoActual).subscribe(
                (horas) => this.totales = horas,
                (error) => this.alertService.error(error, 5000));


        }
        this.layoutService.updatePreloaderState('hide');

    }

    getFilas(horasReporte: HorasReporte1[]) {
        return horasReporte.filter((item) => item.cargo != null);
    }

    getTotal(horasReporte: HorasReporte1[]) {
        return horasReporte.filter((item) => item.cargo == null);
    }

}
