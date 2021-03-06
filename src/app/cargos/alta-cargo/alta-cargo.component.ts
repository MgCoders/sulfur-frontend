import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { Cargo, PrecioHora } from '../../_models/models';
import { CargoImp } from '../../_models/CargoImp';
import { CargoService } from '../../_services/cargo.service';
import { AlertService } from '../../_services/alert.service';
import { LayoutService } from '../../layout/layout.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-alta-cargo',
  templateUrl: './alta-cargo.component.html',
  styleUrls: ['./alta-cargo.component.scss']
})
export class AltaCargoComponent implements OnInit {

  public cargoActual: Cargo;
  public precioInicial: number;

  public nombreFC = new FormControl('', [Validators.required]);
  public codigoFC = new FormControl('', [Validators.required]);
  public decimalRegExp: RegExp = new RegExp('^[0-9]+(\.[0-9]{1,2})?$');
  public precioFC = new FormControl('', [Validators.required, Validators.pattern(this.decimalRegExp)]);

  public loading: boolean;

  constructor(public dialogRef: MatDialogRef<AltaCargoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: [Cargo, Cargo[]],
              private cs: CargoService,
              private as: AlertService,
              private layoutService: LayoutService,
              private datePipe: DatePipe) { }

  ngOnInit() {
    this.loading = false;
    if (this.data[0] === undefined) {
      this.cargoActual = {} as Cargo;
      this.cargoActual.enabled = true;
    } else {
      this.cargoActual = new CargoImp(this.data[0]);
    }
  }

  Cerrar() {
    this.dialogRef.close();
  }

  Guardar() {
    this.loading = true;
    this.layoutService.updatePreloaderState('active');
    if (this.data[0] === undefined) {
      // Agregamos el primer registro de historico de precio.
      this.cargoActual.precioHoraHistoria = new Array();
      const histPrecio: PrecioHora = {} as PrecioHora;
      histPrecio.precioHora = this.precioInicial;
      histPrecio.vigenciaDesde = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
      this.cargoActual.precioHoraHistoria.push(histPrecio);
      this.cs.create(this.cargoActual).subscribe(
        (data) => {
          this.as.success('Cargo agregado correctamente.', 3000);
          this.data[1].push(data);
          this.layoutService.updatePreloaderState('hide');
          this.dialogRef.close();
          this.loading = false;
        },
        (error) => {
          this.layoutService.updatePreloaderState('hide');
          this.as.error(error, 5000);
          this.loading = false;
        });
    } else {
      this.cs.edit(this.cargoActual).subscribe(
        (data) => {
          this.layoutService.updatePreloaderState('hide');
          this.as.success('Cargo actualizado correctamente.', 3000);
          const index: number = this.data[1].indexOf(this.data[0]);
          this.data[1][index] = data;
          this.dialogRef.close();
          this.loading = false;
        },
        (error) => {
          this.layoutService.updatePreloaderState('hide');
          this.as.error(error, 5000);
          this.loading = false;
        });
    }
  }
}
