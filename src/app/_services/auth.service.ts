import { Injectable } from '@angular/core';
import {
    Headers,
    Http,
    RequestOptions,
    Response
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { JwtHelper } from 'angular2-jwt';
import { environment } from '../../environments/environment';
import { Colaborador } from '../_models/Colaborador';

export const TOKEN_NAME: string = 'jwt_token';

@Injectable()
export class AuthService {

    private jwt = new JwtHelper();

    constructor(private http: Http) {
    }

    getToken(): string {
        if (this.getCurrentUser()) {
            return this.getCurrentUser().token;
        } else {
            return null;
        }
    }

    public isAuthenticated(): boolean {
        try {
            const token = this.getToken();
            return (token != null) && !this.jwt.isTokenExpired(token) && (this.getCurrentUser() != null);
        } catch (e) {
            return false;
        }
    }

    public isAuthenticatedAndAdmin(): boolean {
        try {
            const token = this.getToken();
            return (token != null) && !this.jwt.isTokenExpired(token) && (this.getCurrentUser() && this.getCurrentUser().role === 'ADMIN');
        } catch (e) {
            return false;
        }
    }

    login(email: string, password: string): Observable<boolean> {
        const headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        const options = new RequestOptions({headers});
        const body = new URLSearchParams();
        body.set('email', email);
        body.set('password', password);
        const url = `${environment.apiUrl}/users/login`;
        return this.http.post(url, body.toString(), options)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                const user: Colaborador = response.json();
                console.log(user);
                if (user && user.token) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    // return true to indicate successful login
                    return true;
                } else {
                    this.handleErrorObservable(response);
                }
            });
    }

    resetPassword(email: string) {
        return this.http.post(`${environment.apiUrl}/users/recuperar/` + email, {});
    }

    resetEmail(token: string): Observable<any> {
        return this.http.get(`${environment.apiUrl}/users/recuperar/` + token)
            .map((res: Response) => res.json());
    }

    changePassword(token: string, password: string) {
        const headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        const options = new RequestOptions({headers});
        const body = new URLSearchParams();
        body.set('token', token);
        body.set('password', password);
        return this.http.put(`${environment.apiUrl}/users/recuperar/`, body.toString(), options);
    }

    private handleErrorObservable(error: Response | any) {
        return Observable.throw(error.message || error);
    }

    logout(): void {
        localStorage.removeItem('currentUser');
    }

    public getCurrentUser(): Colaborador {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

}
