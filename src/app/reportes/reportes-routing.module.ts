import {
  RouterModule,
  Routes
} from '@angular/router';

import { ReportesComponent } from './reportes.component';
import { HorasReporteComponent } from './reporte1/horas-reporte.component';
import { AdminGuard } from '../_guards/admin.guard';

export const ReportesRoutes: Routes = [
  {
    path: '',
    component: ReportesComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
      {path: 'reporte1', component: HorasReporteComponent},
    ]
  }
];

export const ReportesRoutingModule = RouterModule.forChild(ReportesRoutes);
