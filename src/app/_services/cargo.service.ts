import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Cargo, PrecioHora } from '../_models/models';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CargoService {

  constructor(public http: HttpClient) { }

  getAll(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(`${environment.apiUrl}/cargos/`);
  }

  get(id: number): Observable<Cargo> {
    return this.http.get<Cargo>(`${environment.apiUrl}/cargos/` + id);
  }

  create(x: Cargo): Observable<any> {
    return this.http.post(`${environment.apiUrl}/cargos/`, x);
  }

  addPrecioHora(idCargo: number, x: PrecioHora): Observable<any> {
    return this.http.post(`${environment.apiUrl}/cargos/` + idCargo, x);
  }

  edit(x: Cargo): Observable<any> {
        return this.http.put(`${environment.apiUrl}/cargos/` + x.id, x);
  }
}
