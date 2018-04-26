import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Proyecto } from '../_models/models';
import { Observable } from 'rxjs/Observable';
import { HorasProyectoTipoTareaCargoXColaborador } from '../_models/HorasProyectoTipoTareaCargoXColaborador';
import { HorasReporte1 } from '../_models/HorasProyectoTipoTareaXCargo';
import { EstimacionProyectoTipoTareaXCargo } from '../_models/EstimacionProyectoTipoTareaXCargo';
import { HorasProyectoXCargo } from '../_models/HorasProyectoXCargo';
import { TipoTarea } from '../_models/TipoTarea';
import { DatePipe } from '@angular/common';
import { HorasReporte2 } from '../_models/HorasColaboradorXCargo';

@Injectable()
export class ReporteService {

  constructor(public http: HttpClient,
              private datePipe: DatePipe) { }

  getHorasProyectoTipoTareaCargoXColaborador(): Observable<HorasProyectoTipoTareaCargoXColaborador[]> {
    return this.http.get<HorasProyectoTipoTareaCargoXColaborador[]>(`${environment.apiUrl}/horas/proyecto/tarea/cargo/`);
  }

  getReporte1(proyecto: Proyecto, tarea: TipoTarea): Observable<HorasReporte1[]> {
    return this.http.get<HorasReporte1[]>(`${environment.apiUrl}/reportes/horas/proyecto/` + proyecto.id + `/tarea/` + tarea.id);
  }

  getReporte1Totales(proyecto: Proyecto): Observable<HorasReporte1[]> {
    return this.http.get<HorasReporte1[]>(`${environment.apiUrl}/reportes/horas/proyecto/` + proyecto.id);
  }

  getEstimacionProyectoTipoTareaXCargo(proyecto: Proyecto, tarea: TipoTarea): Observable<EstimacionProyectoTipoTareaXCargo[]> {
    return this.http.get<EstimacionProyectoTipoTareaXCargo[]>(`${environment.apiUrl}/reportes/horas/proyecto/` + proyecto.id + `/tarea/` + tarea.id);
  }

  getHorasProyectoXCargo(proyecto: Proyecto): Observable<HorasProyectoXCargo[]> {
    return this.http.get<HorasProyectoXCargo[]>(`${environment.apiUrl}/reportes/horas/proyecto/` + proyecto.id);
  }

  getResumenHoras(desde: Date, hasta: Date): Observable<HorasReporte1[]> {
    return this.http.get<HorasReporte1[]>(`${environment.apiUrl}/reportes/horas/fechas/` +
      this.datePipe.transform(desde, 'dd-MM-yyyy') + `/` + this.datePipe.transform(hasta, 'dd-MM-yyyy'));
  }

  getResumenHoras_x_proyecto(desde: Date, hasta: Date, idProyecto: number): Observable<HorasReporte1[]> {
    return this.http.get<HorasReporte1[]>(`${environment.apiUrl}/reportes/horas/fechas/` +
      this.datePipe.transform(desde, 'dd-MM-yyyy') + `/` + this.datePipe.transform(hasta, 'dd-MM-yyyy') +
      `/proyecto/` + idProyecto.toString());
  }

  getResumenHoras_x_colaborador(desde: Date, hasta: Date): Observable<HorasReporte2[]> {
    return this.http.get<HorasReporte2[]>(`${environment.apiUrl}/reportes/horas/colaboradores/fechas/` +
      this.datePipe.transform(desde, 'dd-MM-yyyy') + `/` + this.datePipe.transform(hasta, 'dd-MM-yyyy'));
  }

  getResumenHoras_x_Cargo_Proyecto(desde: Date, hasta: Date): Observable<HorasReporte1[]> {
    return this.http.get<HorasReporte1[]>(`${environment.apiUrl}/reportes/horas/proyectos/fechas/` +
      this.datePipe.transform(desde, 'dd-MM-yyyy') + `/` + this.datePipe.transform(hasta, 'dd-MM-yyyy'));
  }
}
