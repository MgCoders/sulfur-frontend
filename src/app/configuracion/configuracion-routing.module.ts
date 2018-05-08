import {
  RouterModule,
  Routes
} from '@angular/router';

import { ConfiguracionComponent } from './configuracion.component';
import { MantenimientoConfiguracionesComponent } from './mantenimiento-configuraciones/mantenimiento-configuraciones.component';
import { AdminGuard } from '../_guards/admin.guard';

export const ConfiguracionRoutes: Routes = [
  {
    path: '',
    component: ConfiguracionComponent,
    children: [
      {
        path: '',
        redirectTo: '/app/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'mantenimiento-configuraciones',
        component: MantenimientoConfiguracionesComponent,
        canActivate: [AdminGuard],
      },
    ]
  }
];

export const ConfiguracionRoutingModule = RouterModule.forChild(ConfiguracionRoutes);
