import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Notificacion } from '../_models/Notificacion';
import { Colaborador } from '../_models/Colaborador';
import { DatePipe } from '@angular/common';

@Injectable()
export class NotificacionService {

    constructor(public http: HttpClient, public datePipe: DatePipe) {
    }

    getAll(): Observable<Notificacion[]> {
        return this.http.get<Notificacion[]>(`${environment.apiUrl}/notificaciones/`);
    }

    getPorUsuarioYFecha(colaborador: Colaborador, desde: Date, hasta: Date): Observable<Notificacion[]> {
        return this.http.get<Notificacion[]>(`${environment.apiUrl}/notificaciones/colaborador/` + colaborador.id + `/` +
            this.datePipe.transform(desde, 'dd-MM-yyyy') + `/` + this.datePipe.transform(hasta, 'dd-MM-yyyy'));
    }
}
