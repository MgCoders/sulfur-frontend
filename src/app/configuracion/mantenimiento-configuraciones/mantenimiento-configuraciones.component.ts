import { Component, OnInit } from '@angular/core';
import { ConfiguracionService } from '../../_services/configuracion.service';
import { MatChipInputEvent } from '@angular/material';
import { ENTER } from '@angular/cdk/keycodes';
import { AlertService } from '../../_services/alert.service';
import { LayoutService } from '../../layout/layout.service';
import { FormControl, Validators } from '@angular/forms';

const COMMA = 188;

@Component({
  selector: 'app-mantenimiento-configuraciones',
  templateUrl: './mantenimiento-configuraciones.component.html',
  styleUrls: ['./mantenimiento-configuraciones.component.scss']
})
export class MantenimientoConfiguracionesComponent implements OnInit {

  public correos: string[];
  public loading: number;
  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  public visible: boolean = true;
  public selectable: boolean = true;
  public removable: boolean = true;
  public addOnBlur: boolean = true;

  public exprMail: RegExp = /^[a-z]+[a-z0-9._-]+@[a-z]+\.[a-z.]{2,5}$/;
  public exprNumreo: RegExp = /^[1-9]+[0-9]*$/;

  public nombreProyecto: string;
  public nombreProyectoFC = new FormControl('', [Validators.required]);

  public periodicidad: number;
  public periodicidadFC = new FormControl('', [Validators.min(0), Validators.required, Validators.pattern(this.exprNumreo)]);

  public urlLogo: string;
  public urlLogoFC = new FormControl('', [Validators.required]);

  public notificacionesPorEmailHabilitadas: boolean;

  constructor(private service: ConfiguracionService,
              private as: AlertService,
              private layoutService: LayoutService) { }

  ngOnInit() {
    this.correos = new Array();
    this.loading = 1;

    this.layoutService.updatePreloaderState('active');
    this.service.getAll('/configuracion/destinatarios').subscribe(
      (data) => {
        this.correos = data;
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      },
      (error) => {
        this.as.error('Error al cargar los destinatarios. ' + error, 5000);
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      }
    );

    this.loading++;
    this.service.get('/configuracion/mail').subscribe(
      (data) => {
        this.notificacionesPorEmailHabilitadas = data === 'true';
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      },
      (error) => {
        this.as.error('Error al cargar /configuracion/mail. ' + error, 5000);
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      }
    );

    this.loading++;
    this.service.get('/configuracion/periodicidad').subscribe(
      (data) => {
        this.periodicidad = +data;
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      },
      (error) => {
        this.as.error('Error al cargar /configuracion/periodicidad. ' + error, 5000);
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      }
    );

    this.loading++;
    this.service.get('/configuracion/project/logo').subscribe(
      (data) => {
        this.urlLogo = data;
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
        this.nombreProyecto = data;
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      },
      (error) => {
        this.as.error('Error al cargar /configuracion/project/name. ' + error, 5000);
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      }
    );
  }

  addCorreo(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Chequeamos el formato del correo.
    if (!this.exprMail.test(value)) {
      this.as.error('El correo ingresado no tiene formato correcto.', 5000);
      return;
    }

    // Add Correo
    if ((value || '').trim()) {
      this.layoutService.updatePreloaderState('active');
      this.loading++;
      this.service.create('/configuracion/destinatarios', value).subscribe(
        (data) => {
          this.correos = data;
          this.loading--;
          if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
        },
        (error) => {
          this.as.error('Error al ingresar el destinatario. ' + error, 5000);
          this.loading--;
          if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
        }
      );
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeCorreo(correo: any): void {
    // Eliminar correo
    this.layoutService.updatePreloaderState('active');
    this.loading++;
    this.service.delete('/configuracion/destinatarios', correo).subscribe(
      (data) => {
        this.correos = data;
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      },
      (error) => {
        this.as.error('Error al borrar el destinatario. ' + error, 5000);
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      }
    );
  }

  Guardar() {
    this.layoutService.updatePreloaderState('active');

    this.loading++;
    this.service.create('/configuracion/mail', this.notificacionesPorEmailHabilitadas ? 'true' : 'false').subscribe(
      (data) => {
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      },
      (error) => {
        this.as.error('Error al guardar /configuracion/mail. ' + error, 5000);
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      }
    );

    this.loading++;
    this.service.create('/configuracion/periodicidad', this.periodicidad.toString()).subscribe(
      (data) => {
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      },
      (error) => {
        this.as.error('Error al guardar /configuracion/periodicidad. ' + error, 5000);
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      }
    );

    this.loading++;
    this.service.create('/configuracion/project/logo', this.urlLogo).subscribe(
      (data) => {
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      },
      (error) => {
        this.as.error('Error al guardar /configuracion/project/logo. ' + error, 5000);
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      }
    );

    this.loading++;
    this.service.create('/configuracion/project/name', this.nombreProyecto).subscribe(
      (data) => {
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      },
      (error) => {
        this.as.error('Error al guardar /configuracion/project/name. ' + error, 5000);
        this.loading--;
        if (this.loading === 0) { this.layoutService.updatePreloaderState('hide'); }
      }
    );
  }
}
