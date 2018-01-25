import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProyectoService } from '../../_services/proyecto.service';
import { AlertService } from '../../_services/alert.service';
import { Proyecto } from '../../_models/models';

@Component({
  selector: 'app-select-proyecto',
  templateUrl: './select-proyecto.component.html',
  styleUrls: ['./select-proyecto.component.scss']
})

export class SelectProyectoComponent implements OnInit {

  @Input() object: any;
  @Input() idModel: string;
  @Input() placeHolder: string;
  @Input() id: string;
  @Input() desc: string;

  @Output() onChange: EventEmitter<Proyecto> = new EventEmitter<Proyecto>();

  public lista: Proyecto[];

  constructor(private service: ProyectoService,
              private as: AlertService) { }

  ngOnInit() {
    this.lista = [];
    this.service.getAll().subscribe(
      (data) => {
        this.lista = data;
      },
      (error) => {
        this.as.error(error, 5000);
      });
  }

  onChangeValue(evt) {
    this.onChange.emit(this.lista.find((x) => x.id === evt.value));
  }
}
