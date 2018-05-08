import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientoConfiguracionesComponent } from './mantenimiento-configuraciones/mantenimiento-configuraciones.component';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatChipsModule,
  MatSnackBarModule,
  MatSelectModule,
  MatTooltipModule,
  MatDialogModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { ConfiguracionComponent } from './configuracion.component';
import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { ConfiguracionService } from '../_services/configuracion.service';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ConfiguracionRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],

  declarations: [
    ConfiguracionComponent,
    MantenimientoConfiguracionesComponent
  ],

  providers: [
    ConfiguracionService,
  ]
})
export class ConfiguracionModule { }
