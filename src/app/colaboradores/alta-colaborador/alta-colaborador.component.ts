import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { Colaborador, ColaboradorImp, Cargo } from '../../_models/models';
import { ColaboradorService } from '../../_services/colaborador.service';
import { AlertService } from '../../_services/alert.service';
import { LayoutService } from '../../layout/layout.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-alta-colaborador',
  templateUrl: './alta-colaborador.component.html',
  styleUrls: ['./alta-colaborador.component.scss']
})
export class AltaColaboradorComponent implements OnInit {

  public colaboradorActual: Colaborador;
  public cargoActual: Cargo;
  public esAdmin: boolean;

  public nombreFC = new FormControl('', [Validators.required]);
  public mailFC = new FormControl('', [Validators.required, Validators.email]);

  constructor(public dialogRef: MatDialogRef<AltaColaboradorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: [Colaborador, Colaborador[]],
              private cs: ColaboradorService,
              private as: AlertService,
              private layoutService: LayoutService) { }

  ngOnInit() {
    this.cargoActual = {} as Cargo;
    if (this.data[0] === undefined) {
      this.colaboradorActual = {} as Colaborador;
      this.colaboradorActual.role = 'USER';
      this.colaboradorActual.token = '';
      this.esAdmin = false;
    } else {
      this.colaboradorActual = new ColaboradorImp(this.data[0]);
      this.cargoActual = this.colaboradorActual.cargo;
      this.esAdmin = this.colaboradorActual.role === 'ADMIN';
    }
  }

  Cerrar() {
    this.dialogRef.close();
  }

  Guardar() {
    this.layoutService.updatePreloaderState('active');
    this.colaboradorActual.role = this.esAdmin ? 'ADMIN' : 'USER';

    if (this.data[0] === undefined) {
      this.cs.create(this.colaboradorActual).subscribe(
        (data) => {
          this.layoutService.updatePreloaderState('hide');
          this.as.success('Colaborador agregado correctamente.', 3000);
          this.data[1].push(data);
          this.dialogRef.close();
        },
        (error) => {
          this.layoutService.updatePreloaderState('hide');
          this.as.error(error, 5000);
        });
    } else {
      this.cs.edit(this.colaboradorActual).subscribe(
        (data) => {
          this.layoutService.updatePreloaderState('hide');
          this.as.success('Colaborador actualizado correctamente.', 3000);
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

  CargoOnChange(x: Cargo) {
    this.colaboradorActual.cargo = x;
  }
}
