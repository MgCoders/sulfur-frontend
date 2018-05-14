import * as jQuery from 'jquery';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { APPCONFIG } from './config';
import { LayoutService } from './layout/layout.service';

// 3rd
import 'styles/material2-theme.scss';
import 'styles/bootstrap.scss';
// custom
import 'styles/layout.scss';
import 'styles/theme.scss';
import 'styles/ui.scss';
import 'styles/app.scss';

import { ConfiguracionService } from './_services/configuracion.service';
import { AlertService } from './_services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [LayoutService],
})

export class AppComponent implements OnInit {

  public AppConfig: any;
  public loading: number;

  constructor(private router: Router,
              private service: ConfiguracionService,
              private layoutService: LayoutService,
              private as: AlertService) { }

  ngOnInit() {
    this.loading = 0;

    this.AppConfig = APPCONFIG;

    this.loading++;
    this.service.get('/configuracion/project/logo').subscribe(
      (data) => {
        this.AppConfig.brandLogoUrl = data;
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      },
      (error) => {
        this.as.error('Error al cargar /configuracion/project/logo. ' + error, 5000);
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      }
    );

    this.loading++;
    this.service.get('/configuracion/project/name').subscribe(
      (data) => {
        this.AppConfig.brand = data;
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      },
      (error) => {
        this.as.error('Error al cargar /configuracion/project/name. ' + error, 5000);
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      }
    );

    // Scroll to top on route change
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
