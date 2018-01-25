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
      { path: 'reportes', loadChildren: '../reportes/reportes.module#ReportesModule' }
    ]
  }
];

export const LayoutRoutingModule = RouterModule.forChild(routes);
