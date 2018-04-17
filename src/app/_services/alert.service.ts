import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class AlertService {
    private subject = new Subject<any>();

    constructor(private router: Router,
                private snackBar: MatSnackBar) {
    }

    success(message: string, time: number, keepAfterNavigationChange = false) {
        this.snackBar.open(message, 'Cerrar', {
            duration: time,
            extraClasses: ['alert-success']
        });
    }

    error(message: any, time: number, keepAfterNavigationChange = false) {
        let errorMg: string = '';
        if (message.error !== undefined) {
            errorMg = message.error;
        } else {
            errorMg = message;
        }

        // Si es un error devuelto por el servidor.
/*         if (message.status !== undefined) {

            const body: any = JSON.parse(message._body);
            errorMg = '';

            // Si hay un error con el modelo.
            if (body.ModelState !== undefined) {
                for (var key in body.ModelState) {
                    errorMg += key + ": ";
                    body.ModelState[key].forEach(element => {
                        errorMg += element + ". ";
                    });
                }
            }
            // Si es un error interno.
            else {

                // Si es un error de autorización.
                if (message.status == 401) {
                    errorMg = "Acceso denegado, compruebe que tiene los permisos necesarios o que su sesion no haya expirado.";
                }
                else
                    errorMg = body.Message;
            }
        } */

        this.snackBar.open(errorMg, 'Cerrar', {
            duration: time,
            extraClasses: ['alert-error']
        });
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
