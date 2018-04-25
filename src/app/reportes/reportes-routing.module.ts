import {
  RouterModule,
  Routes
} from '@angular/router';

import { ReportesComponent } from './reportes.component';
import { HorasEstimadasVsCargadasComponent } from './horas-estimadas-vs-cargadas/horas-estimadas-vs-cargadascomponent';
import { HistoricoHorasComponent } from './historico-horas/historico-horas.component';
import { MisHorasComponent } from './mis-horas/mis-horas.component';
import { ReporteHorasDelMesComponent } from './reporte-horas-del-mes/reporte-horas-del-mes.component';
import { AdminGuard } from '../_guards/admin.guard';
import { ResumenEstudioComponent } from './resumen-estudio/resumen-estudio.component';

export const ReportesRoutes: Routes = [
  {
    path: '',
    component: ReportesComponent,
    children: [
      {
        path: '',
        redirectTo: '/app/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'horas-estimadas-vs-cargadas',
        component: HorasEstimadasVsCargadasComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'historico-horas',
        component: HistoricoHorasComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'resumen-estudio',
        component: ResumenEstudioComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'reporte-horas-del-mes',
        component: ReporteHorasDelMesComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'mis-horas',
        component: MisHorasComponent
      },
    ]
  }
];

export const ReportesRoutingModule = RouterModule.forChild(ReportesRoutes);
