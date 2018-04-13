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
  MatProgressSpinnerModule,
  MatCheckboxModule
} from '@angular/material';

import { TareasComponent } from './tareas.component';
import { TareasRoutingModule } from './tareas-routing.module';
import { ListaTareasComponent } from './lista-tareas/lista-tareas.component';
import { SelectTareaComponent } from './select-tarea/select-tarea.component';
import { AltaTareaComponent } from './alta-tarea/alta-tarea.component';

import { TareaService } from '../_services/tarea.service';
import { AlertService } from '../_services/alert.service';
import { LayoutService } from '../layout/layout.service';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TareasRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],

  declarations: [
    TareasComponent,
    ListaTareasComponent,
    SelectTareaComponent,
    AltaTareaComponent
  ],

  exports: [
    SelectTareaComponent
  ],

  providers: [
    TareaService,
    AlertService,
    LayoutService,
  ],

  entryComponents: [
    AltaTareaComponent,
  ],
})
export class TareasModule { }
