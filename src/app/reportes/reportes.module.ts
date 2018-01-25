import { NgModule } from '@angular/core';
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
    MatNativeDateModule,
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
import { HorasReporteComponent } from './reporte1/horas-reporte.component';
import { TableDataTableComponent } from './data-table/data-table.component';
import { ProyectosModule } from '../proyectos/proyectos.module';
import { TareasModule } from '../tareas/tareas.module';
import { ProyectoService } from '../_services/proyecto.service';
import { AuthService } from '../_services/auth.service';
import { TareaService } from '../_services/tarea.service';
import { ReporteService } from '../_services/reporte.service';
import { AlertService } from '../_services/alert.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../layout/layout.service';
import { CargoService } from '../_services/cargo.service';

@NgModule({
    imports: [
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
        MatNativeDateModule,
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
        CommonModule
    ],
    declarations: [
        ReportesComponent,
        TableDataTableComponent,
        TableResponsiveComponent,
        HorasReporteComponent,
    ],
    providers: [
        AlertService,
        ProyectoService,
        AuthService,
        TareaService,
        ReporteService,
        LayoutService,
        CargoService
    ]
})

export class ReportesModule {
}
