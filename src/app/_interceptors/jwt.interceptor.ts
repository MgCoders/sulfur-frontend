import 'rxjs/add/operator/do';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../_services/auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../_services/alert.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(public auth: AuthService,
              private router: Router,
              public alertService: AlertService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
        console.log(event);
      }
    }, (err: any) => {
      console.log(err);
      if (err instanceof HttpErrorResponse) {
        //this.alertService.error('Error de Autenticación', 5000);
        if (err.status === 401) {
          this.router.navigate(['extra/login']);
          console.log('unauthorized');
        }
      }
    });
  }
}
