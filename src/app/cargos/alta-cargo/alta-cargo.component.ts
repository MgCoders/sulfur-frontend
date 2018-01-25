import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { Cargo } from '../../_models/models';
import { CargoImp } from '../../_models/CargoImp';
import { CargoService } from '../../_services/cargo.service';
import { AlertService } from '../../_services/alert.service';
import { LayoutService } from '../../layout/layout.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-alta-cargo',
  templateUrl: './alta-cargo.component.html',
  styleUrls: ['./alta-cargo.component.scss']
})
export class AltaCargoComponent implements OnInit {

  public cargoActual: Cargo;

  public nombreFC = new FormControl('', [Validators.required]);
  public codigoFC = new FormControl('', [Validators.required]);

  constructor(public dialogRef: MatDialogRef<AltaCargoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: [Cargo, Cargo[]],
              private cs: CargoService,
              private as: AlertService,
              private layoutService: LayoutService) { }

  ngOnInit() {
    if (this.data[0] === undefined) {
      this.cargoActual = {} as Cargo;
    } else {
      this.cargoActual = new CargoImp(this.data[0]);
    }
  }

  Cerrar() {
    this.dialogRef.close();
  }

  Guardar() {
    this.layoutService.updatePreloaderState('active');
    if (this.data[0] === undefined) {
      this.cs.create(this.cargoActual).subscribe(
        (data) => {
          this.as.success('Cargo agregado correctamente.', 3000);
          this.data[1].push(data);
          this.layoutService.updatePreloaderState('hide');
          this.dialogRef.close();
        },
        (error) => {
          this.layoutService.updatePreloaderState('hide');
          this.as.error(error, 5000);
        });
    } else {
      this.cs.edit(this.cargoActual).subscribe(
        (data) => {
          this.layoutService.updatePreloaderState('hide');
          this.as.success('Cargo actualizado correctamente.', 3000);
          const index: number = this.data[1].indexOf(this.data[0]);
          this.data[1][index] = data;
          this.dialogRef.close();
        },
        (error) => {
          this.layoutService.updatePreloaderState('hide');
          this.as.error(error, 5000);
        });
    }
  }
}
