import { Routes, RouterModule } from '@angular/router';

import { ListaColaboradoresComponent } from './lista-colaboradores/lista-colaboradores.component';
import { AltaColaboradorComponent } from './alta-colaborador/alta-colaborador.component';
import { ColaboradoresComponent } from './colaboradores.component';

export const ColaboradoresRoutes: Routes = [
  {
    path: '',
    component: ColaboradoresComponent,
    children: [
      { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
      { path: 'lista', component: ListaColaboradoresComponent },
      { path: 'alta', component: AltaColaboradorComponent },
    ]
  }
];

export const ColaboradoresRoutingModule = RouterModule.forChild(ColaboradoresRoutes);