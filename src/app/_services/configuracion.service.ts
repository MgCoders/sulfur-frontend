import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConfiguracionService {

  constructor(public http: HttpClient) { }

  getAll(config: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}` + config);
  }

  get(config: string): Observable<string> {
    return this.http.get(`${environment.apiUrl}` + config, {responseType: 'text'});
  }

  create(config: string, x: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type' : 'application/json; charset=utf-8'});
    return this.http.request('post', `${environment.apiUrl}` + config, { body: x, headers, responseType: 'text' } );
  }

  edit(config: string, x: string): Observable<any> {
        return this.http.put(`${environment.apiUrl}` + config, x);
  }

  delete(config: string, x: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type' : 'application/json; charset=utf-8'});
    return this.http.request('delete', `${environment.apiUrl}` + config, { body: x, headers, responseType: 'text' } );
  }
}
