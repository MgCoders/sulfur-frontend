import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,
         ReactiveFormsModule,
} from '@angular/forms';
import {
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatSnackBarModule,
  MatSelectModule,
  MatTooltipModule,
  MatDialogModule,
  MatCheckboxModule,
} from '@angular/material';

import { ListaColaboradoresComponent } from './lista-colaboradores/lista-colaboradores.component';
import { ColaboradoresRoutingModule } from './colaboradores-routing.module';
import { AltaColaboradorComponent } from './alta-colaborador/alta-colaborador.component';
import { SelectColaboradorComponent } from './select-colaborador/select-colaborador.component';
import { ColaboradoresComponent } from './colaboradores.component';

import { ColaboradorService } from '../_services/colaborador.service';
import { AlertService } from '../_services/alert.service';
import { LayoutService } from '../layout/layout.service';

import { CargosModule } from '../cargos/cargos.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ColaboradoresRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    CargosModule,
    MatCheckboxModule,
  ],

  declarations: [
    ColaboradoresComponent,
    ListaColaboradoresComponent,
    AltaColaboradorComponent,
    SelectColaboradorComponent,
  ],

  exports: [
    SelectColaboradorComponent,
  ],

  providers: [
    ColaboradorService,
    AlertService,
    LayoutService,
  ],

  entryComponents: [
    AltaColaboradorComponent,
  ],
})
export class ColaboradoresModule { }
