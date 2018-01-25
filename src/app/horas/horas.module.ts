import { NgModule } from '@angular/core';
import {
  CommonModule,
  DatePipe,
  DecimalPipe
} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatButtonModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSliderModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule,
  MatDialogModule,
  MatCardModule,
} from '@angular/material';

import { HorasComponent } from './horas.component';
import { HorasRoutingModule } from './horas-routing.module';
import { ListaHorasComponent } from './lista-horas/lista-horas.component';

import { ColaboradoresModule } from '../colaboradores/colaboradores.module';
import { ProyectosModule } from '../proyectos/proyectos.module';
import { TareasModule } from '../tareas/tareas.module';
import { SelectHoraDesdeComponent } from './select-hora-desde/select-hora-desde.component';
import { SelectHoraHastaComponent } from './select-hora-hasta/select-hora-hasta.component';

import { HoraService } from '../_services/hora.service';
import { AlertService } from '../_services/alert.service';
import { LayoutService } from '../layout/layout.service';
import { EditHoraComponent } from './edit-hora/edit-hora.component';

import { TimePipe } from '../_pipes/time.pipe';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HorasRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTooltipModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatSliderModule,
    ColaboradoresModule,
    ProyectosModule,
    TareasModule,
    MatDialogModule,
    MatSliderModule,
    MatCardModule,
  ],

  declarations: [
    HorasComponent,
    ListaHorasComponent,
    SelectHoraDesdeComponent,
    SelectHoraHastaComponent,
    EditHoraComponent,
    TimePipe
  ],

  providers: [
    HoraService,
    AlertService,
    LayoutService,
    DatePipe,
    DecimalPipe,
    TimePipe
  ],

  entryComponents: [
    EditHoraComponent,
  ]
})
export class HorasModule { }
