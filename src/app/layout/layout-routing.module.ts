import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AuthGuard } from '../_guards/auth.guard';

const routes: Routes = [
  {
    path: 'app',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'proyectos', loadChildren: '../proyectos/proyectos.module#ProyectosModule' },
      { path: 'cargos', loadChildren: '../cargos/cargos.module#CargosModule' },
      { path: 'tareas', loadChildren: '../tareas/tareas.module#TareasModule' },
      { path: 'colaboradores', loadChildren: '../colaboradores/colaboradores.module#ColaboradoresModule' },
      { path: 'proyectos', loadChildren: '../proyectos/proyectos.module#ProyectosModule' },
      { path: 'horas', loadChildren: '../horas/horas.module#HorasModule' },
      { path: 'reportes', loadChildren: '../reportes/reportes.module#ReportesModule' },
      { path: 'estimaciones', loadChildren: '../estimaciones/estimaciones.module#EstimacionesModule' },
      { path: 'configuraciones', loadChildren: '../configuracion/configuracion.module#ConfiguracionModule' },
      { path: 'chart', loadChildren: '../charts/charts.module#ChartsModule' },
      { path: 'form', loadChildren: '../forms/forms.module#MyFormsModule' },
      { path: 'page', loadChildren: '../pages/pages.module#PagesModule' },
      { path: 'pglayout', loadChildren: '../page-layouts/page-layouts.module#PageLayoutsModule' },
      { path: 'table', loadChildren: '../tables/tables.module#MyTablesModule' },
      { path: 'ui', loadChildren: '../ui/ui.module#UIModule' },
    ]
  }
];

export const LayoutRoutingModule = RouterModule.forChild(routes);
