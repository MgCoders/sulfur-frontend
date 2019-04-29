import { NgModule } from '@angular/core';

import { EChartsDirective } from './echarts.directive';
import { SlimScrollDirective } from './slim-scroll.directive';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';

import {
  MatDialogModule,
  MatButtonModule,
  MatIconModule,
} from '@angular/material';

import { DisableControlDirective } from '../_directives/disable-control.directive';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';
import { SortDirectionComponent } from './sort-direction/sort-direction.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  declarations: [
    EChartsDirective,
    SlimScrollDirective,
    DialogConfirmComponent,
    DisableControlDirective,
    DialogInfoComponent,
    SortDirectionComponent
  ],
  exports: [
    EChartsDirective,
    SlimScrollDirective,
    DialogConfirmComponent,
    DisableControlDirective,
    DialogInfoComponent,
    SortDirectionComponent
  ],

  entryComponents: [
    DialogConfirmComponent,
    DialogInfoComponent
  ]
})

export class SharedModule {}
