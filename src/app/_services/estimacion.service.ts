import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Estimacion } from '../_models/models';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EstimacionService {

  constructor(public http: HttpClient) { }

  getAll(): Observable<Estimacion[]> {
    return this.http.get<Estimacion[]>(`${environment.apiUrl}/estimaciones/`);
  }

  get(id: number): Observable<Estimacion> {
    return this.http.get<Estimacion>(`${environment.apiUrl}/estimaciones/` + id);
  }

  getPorProyecto(idProyecto: number): Observable<Estimacion[]> {
    return this.http.get<Estimacion[]>(`${environment.apiUrl}/estimaciones/proyecto/` + idProyecto);
  }

  create(x: Estimacion): Observable<any> {
    return this.http.post(`${environment.apiUrl}/estimaciones/`, x);
  }

  edit(x: Estimacion): Observable<any> {
        return this.http.put(`${environment.apiUrl}/estimaciones/` + x.id, x);
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/estimaciones/delete/` + id, null);
  }
}
