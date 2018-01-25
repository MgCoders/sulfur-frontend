import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { Cargo, PrecioHora } from '../../_models/models';
import { PrecioHoraImp } from '../../_models/PrecioHoraImp';
import { CargoService } from '../../_services/cargo.service';
import { AlertService } from '../../_services/alert.service';
import { LayoutService } from '../../layout/layout.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-alta-precio-cargo',
  templateUrl: './alta-precio-cargo.component.html',
  styleUrls: ['./alta-precio-cargo.component.scss']
})
export class AltaPrecioCargoComponent implements OnInit {

    public fechaActual: Date;
    public precioActual: PrecioHora;

    public decimalRegExp: RegExp = new RegExp('^[0-9]+(\.[0-9]{1,2})?$');
    public importeFC = new FormControl('', [Validators.required, Validators.pattern(this.decimalRegExp)]);
    public fechaFC = new FormControl('', [Validators.required]);

    constructor(public dialogRef: MatDialogRef<AltaPrecioCargoComponent>,
                @Inject(MAT_DIALOG_DATA) public data: [PrecioHora, Cargo],
                private cs: CargoService,
                private as: AlertService,
                private layoutService: LayoutService,
                private datePipe: DatePipe) { }

    ngOnInit() {
      if (this.data[0] === undefined) {
        this.precioActual = {} as PrecioHora;
        this.fechaActual = new Date();
      } else {
        this.precioActual = new PrecioHoraImp(this.data[0]);
        this.fechaActual = this.dateFromString(this.precioActual.vigenciaDesde);
      }
    }

    Cerrar() {
      this.dialogRef.close();
    }

    Guardar() {
      this.layoutService.updatePreloaderState('active');
      this.precioActual.vigenciaDesde = this.datePipe.transform(this.fechaActual, 'dd-MM-yyyy');
      if (this.data[0] === undefined) {
        this.cs.addPrecioHora(this.data[1].id, this.precioActual).subscribe(
          (data) => {
            this.as.success('Precio agregado correctamente.', 3000);
            this.layoutService.updatePreloaderState('hide');
            this.dialogRef.close({status: true});
          },
          (error) => {
            this.layoutService.updatePreloaderState('hide');
            this.as.error(error, 5000);
          });
      } else {
        this.cs.addPrecioHora(this.data[1].id, this.precioActual).subscribe(
          (data) => {
            this.layoutService.updatePreloaderState('hide');
            this.as.success('Precio actualizado correctamente.', 3000);
            this.dialogRef.close({status: true});
          },
          (error) => {
            this.layoutService.updatePreloaderState('hide');
            this.as.error(error, 5000);
          });
      }
    }

    dateFromString(str: string): Date {
      const aux: string[] = str.split('-');
      return new Date(+aux[2], +aux[1] - 1, +aux[0]);
    }
  }
