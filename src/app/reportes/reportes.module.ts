import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './reportes.component';

import { TableResponsiveComponent } from './responsive/responsive.component';
import { HorasEstimadasVsCargadasComponent } from './horas-estimadas-vs-cargadas/horas-estimadas-vs-cargadascomponent';
import { TableDataTableComponent } from './data-table/data-table.component';
import { ProyectosModule } from '../proyectos/proyectos.module';
import { TareasModule } from '../tareas/tareas.module';
import { ProyectoService } from '../_services/proyecto.service';
import { AuthService } from '../_services/auth.service';
import { TareaService } from '../_services/tarea.service';
import { ReporteService } from '../_services/reporte.service';
import { AlertService } from '../_services/alert.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule,
         DatePipe,
         DecimalPipe
} from '@angular/common';
import { LayoutService } from '../layout/layout.service';
import { CargoService } from '../_services/cargo.service';
import { HoraService } from '../_services/hora.service';
import { MisHorasComponent } from './mis-horas/mis-horas.component';
import { PipesModule } from '../_pipes/pipes.module';
import { HistoricoHorasComponent } from './historico-horas/historico-horas.component';
import { ColaboradoresModule } from '../colaboradores/colaboradores.module';
import { ReporteHorasDelMesComponent } from './reporte-horas-del-mes/reporte-horas-del-mes.component';
import { PapaParseModule } from 'ngx-papaparse';
import { ResumenEstudioComponent } from './resumen-estudio/resumen-estudio.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        ReportesRoutingModule,
        CdkTableModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        ProyectosModule,
        TareasModule,
        CommonModule,
        PipesModule,
        ColaboradoresModule,
        PapaParseModule
    ],
    declarations: [
        ReportesComponent,
        TableDataTableComponent,
        TableResponsiveComponent,
        HorasEstimadasVsCargadasComponent,
        MisHorasComponent,
        HistoricoHorasComponent,
        ReporteHorasDelMesComponent,
        ResumenEstudioComponent,
    ],
    providers: [
        AlertService,
        ProyectoService,
        AuthService,
        TareaService,
        ReporteService,
        LayoutService,
        CargoService,
        DatePipe,
        DecimalPipe,
        HoraService
    ]
})

export class ReportesModule {
}
