import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatSnackBarModule,
  MatSelectModule,
  MatTooltipModule,
  MatDialogModule,
  MatCheckboxModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { AltaProyectoComponent } from './alta-proyecto/alta-proyecto.component';
import { ProyectosRoutingModule } from './proyectos-routing.module';
import { ProyectosComponent } from './proyectos.component';
import { ListaProyectosComponent } from './lista-proyectos/lista-proyectos.component';
import { SelectProyectoComponent } from './select-proyecto/select-proyecto.component';

import { ProyectoService } from '../_services/proyecto.service';
import { AlertService } from '../_services/alert.service';
import { LayoutService } from '../layout/layout.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ProyectosRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    SharedModule
  ],

  declarations: [
    ProyectosComponent,
    AltaProyectoComponent,
    ListaProyectosComponent,
    SelectProyectoComponent
  ],

  exports: [
    SelectProyectoComponent
  ],

  providers: [
    ProyectoService,
    AlertService,
    LayoutService,
  ],

  entryComponents: [
    AltaProyectoComponent,
  ],
})
export class ProyectosModule { }
