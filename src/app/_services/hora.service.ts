import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Hora } from '../_models/models';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';

@Injectable()
export class HoraService {

  constructor(public http: HttpClient,
              private datePipe: DatePipe) { }

  getAll(): Observable<Hora[]> {
    return this.http.get<Hora[]>(`${environment.apiUrl}/horas/`);
  }

  getPorUsuarioYFecha(idUsuario: number, desde: Date, hasta: Date): Observable<Hora[]> {
    return this.http.get<Hora[]>(`${environment.apiUrl}/horas/user/` + idUsuario.toString() + `/` +
    this.datePipe.transform(desde, 'dd-MM-yyyy') + `/` + this.datePipe.transform(hasta, 'dd-MM-yyyy'));
  }

  get(id: number): Observable<Hora> {
    return this.http.get<Hora>(`${environment.apiUrl}/horas/` + id);
  }

  create(x: Hora): Observable<any> {
    console.info(JSON.stringify(x));
    return this.http.post(`${environment.apiUrl}/horas/`, x);
  }

  edit(x: Hora): Observable<any> {
    return this.http.put(`${environment.apiUrl}/horas/` + x.id, x);
  }

  delete(x: Hora): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/horas/` + x.id);
  }
}
